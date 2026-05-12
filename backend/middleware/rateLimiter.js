const rateLimit = require('express-rate-limit');
const { createAuditLog } = require('../utils/auditLogger');

// Store pour les tentatives de connexion
const loginAttempts = new Map();
const ipAttempts = new Map();

// Nettoyer les tentatives expirées
setInterval(() => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;

  for (const [key, data] of loginAttempts.entries()) {
    if (now - data.timestamp > windowMs) {
      loginAttempts.delete(key);
    }
  }

  for (const [key, data] of ipAttempts.entries()) {
    if (now - data.timestamp > windowMs) {
      ipAttempts.delete(key);
    }
  }
}, 15 * 60 * 1000);

// Fonction pour vérifier le rate limiting
const isRateLimited = async (identifier, type = 'login') => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 5;

  const attemptsMap = type === 'login' ? loginAttempts : ipAttempts;
  const key = `${type}:${identifier}`;

  if (!attemptsMap.has(key)) {
    attemptsMap.set(key, {
      count: 1,
      timestamp: now,
      blocked: false
    });
    return false;
  }

  const data = attemptsMap.get(key);

  if (now - data.timestamp > windowMs) {
    attemptsMap.set(key, {
      count: 1,
      timestamp: now,
      blocked: false
    });
    return false;
  }

  if (data.blocked) {
    return true;
  }

  data.count++;

  if (data.count >= maxAttempts) {
    data.blocked = true;
    
    await createAuditLog('RATE_LIMIT_BLOCKED', 'SECURITY', {
      identifier,
      type,
      attempts: data.count
    });
  }

  attemptsMap.set(key, data);
  return data.blocked;
};

// Rate limiters
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'Trop de tentatives. Réessayez dans 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    error: 'Trop de requêtes. Réessayez dans 1 minute.',
    code: 'API_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter pour les routes sensibles (admin)
const adminRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 requêtes par 5 minutes par IP
  message: {
    error: 'Trop de requêtes. Réessayez dans 5 minutes.',
    code: 'ADMIN_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await createAuditLog('ADMIN_RATE_LIMIT_EXCEEDED', 'SECURITY', {
      ip: req.ip || req.connection.remoteAddress,
      path: req.path,
      method: req.method,
      userAgent: req.get('User-Agent')
    });

    res.status(429).json({
      error: 'Trop de requêtes. Réessayez dans 5 minutes.',
      code: 'ADMIN_RATE_LIMIT_EXCEEDED'
    });
  }
});

// Middleware pour bloquer les IPs malveillantes
const blockMaliciousIPs = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Liste d'IPs bloquées (en production, utilisez une base de données)
  const blockedIPs = process.env.BLOCKED_IPS ? process.env.BLOCKED_IPS.split(',') : [];
  
  if (blockedIPs.includes(clientIP)) {
    createAuditLog('BLOCKED_IP_ACCESS', 'SECURITY', {
      ip: clientIP,
      path: req.path,
      method: req.method,
      userAgent: req.get('User-Agent')
    });

    return res.status(403).json({
      error: 'Accès refusé',
      code: 'IP_BLOCKED'
    });
  }

  next();
};

// Middleware pour détecter les patterns suspects
const detectSuspiciousActivity = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || '';
  const path = req.path;
  const method = req.method;

  // Détecter les patterns suspects
  const suspiciousPatterns = [
    /\.\.\//, // Directory traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection attempts
    /eval\(/i, // JavaScript injection
    /document\.cookie/i, // Cookie theft attempts
  ];

  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(req.url) || pattern.test(userAgent)
  );

  if (isSuspicious) {
    createAuditLog('SUSPICIOUS_ACTIVITY', 'SECURITY', {
      ip: clientIP,
      path,
      method,
      userAgent,
      url: req.url,
      headers: req.headers
    });

    // Optionnel : bloquer immédiatement
    if (process.env.BLOCK_SUSPICIOUS === 'true') {
      return res.status(403).json({
        error: 'Activité suspecte détectée',
        code: 'SUSPICIOUS_ACTIVITY'
      });
    }
  }

  next();
};

module.exports = {
  isRateLimited,
  authRateLimiter,
  apiRateLimiter,
  adminRateLimiter,
  blockMaliciousIPs,
  detectSuspiciousActivity
}; 