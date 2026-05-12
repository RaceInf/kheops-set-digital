require('dotenv').config();
const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const winston = require('winston');
const { createAuditLog } = require('./utils/auditLogger');
const Database = require('./config/database');

// Import routes
// (à compléter après création des fichiers)
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const articleRoutes = require('./routes/articles');
// const auditRoutes = require('./routes/audit');

const app = express();

// Logger Winston
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: process.env.LOG_FILE_PATH || './logs/app.log' })
  ]
});

// Middleware sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// HSTS
if (process.env.SECURITY_HEADERS_ENABLED === 'true') {
  app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', `max-age=${process.env.HSTS_MAX_AGE || 31536000}`);
    next();
  });
}

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://localhost:8081',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression
app.use(compression());

// Logger HTTP
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  message: {
    error: 'Trop de requêtes. Réessayez dans 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes (à activer après création)
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/articles', articleRoutes);
// app.use('/api/audit', auditRoutes);

// Middleware de logging des requêtes
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    // Log des erreurs
    if (res.statusCode >= 400) {
      console.error('❌ Erreur HTTP:', logData);
      
      // Log d'audit pour les erreurs de sécurité
      if (res.statusCode === 401 || res.statusCode === 403) {
        createAuditLog('SECURITY_ERROR', 'ERROR', {
          ip: logData.ip,
          method: logData.method,
          url: logData.url,
          status: logData.status,
          userAgent: logData.userAgent
        });
      }
    } else {
      console.log('✅ Requête HTTP:', logData);
    }
  });

  next();
});

// Middleware de gestion des erreurs globales
app.use((error, req, res, next) => {
  console.error('❌ Erreur non gérée:', error);
  
  createAuditLog('UNHANDLED_ERROR', 'ERROR', {
    ip: req.ip || req.connection.remoteAddress,
    method: req.method,
    url: req.url,
    error: error.message,
    stack: error.stack
  });

  res.status(500).json({
    error: 'Erreur interne du serveur',
    code: 'INTERNAL_ERROR'
  });
});

// Routes
const authRoutes = require('./routes/auth');
const articlesRoutes = require('./routes/articles');
const adminRoutes = require('./routes/admin');
const ga4Routes = require('./routes/ga4');

app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ga4', ga4Routes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// HTTPS/HTTP server
const PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Initialiser la base de données
let db;
const initializeDatabase = async () => {
  try {
    db = new Database();
    await db.initialize();
    app.locals.db = db;
    console.log('✅ Base de données initialisée');
  } catch (error) {
    console.error('❌ Erreur d\'initialisation de la base de données:', error);
    process.exit(1);
  }
};

// Fonction de démarrage du serveur HTTP
const startHttpServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur HTTP démarré sur le port ${PORT}`);
    console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
  });
};

// Fonction de démarrage du serveur HTTPS
const startHttpsServer = () => {
  try {
    // Vérifier si les certificats SSL existent
    const certPath = process.env.SSL_CERT_PATH || './ssl/cert.pem';
    const keyPath = process.env.SSL_KEY_PATH || './ssl/key.pem';

    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      console.warn('⚠️  Certificats SSL non trouvés. Démarrage en mode HTTP uniquement.');
      console.warn('📝 Pour activer HTTPS, créez les certificats SSL dans le dossier ./ssl/');
      startHttpServer();
      return;
    }

    const httpsOptions = {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath)
    };

    https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
      console.log(`🔒 Serveur HTTPS démarré sur le port ${HTTPS_PORT}`);
      console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 URL: https://localhost:${HTTPS_PORT}`);
    });

    // Démarrer aussi le serveur HTTP pour la redirection
    startHttpServer();

  } catch (error) {
    console.error('❌ Erreur lors du démarrage HTTPS:', error);
    console.log('🔄 Démarrage en mode HTTP uniquement...');
    startHttpServer();
  }
};

// Gestion de l'arrêt gracieux
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Signal ${signal} reçu. Arrêt gracieux...`);
  
  try {
    if (db) {
      await db.close();
      console.log('✅ Connexion à la base de données fermée');
    }
    
    console.log('✅ Serveur arrêté avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'arrêt:', error);
    process.exit(1);
  }
};

// Écouter les signaux d'arrêt
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non capturée:', error);
  createAuditLog('UNCAUGHT_EXCEPTION', 'CRITICAL', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée non gérée:', reason);
  createAuditLog('UNHANDLED_REJECTION', 'CRITICAL', {
    reason: reason?.message || reason,
    promise: promise.toString()
  });
  process.exit(1);
});

// Initialiser et démarrer le serveur
const startServer = async () => {
  try {
    console.log('🚀 Démarrage du serveur KHEOPS SET DIGITAL...');
    
    // Initialiser la base de données
    await initializeDatabase();
    
    // Démarrer le serveur HTTPS (ou HTTP si pas de certificats)
    startHttpsServer();
    
    console.log('✅ Serveur prêt !');
    
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer(); 