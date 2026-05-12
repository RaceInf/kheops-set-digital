const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { createAuditLog } = require('../utils/auditLogger');
const { generateTOTP, verifyTOTP } = require('../utils/totp');
const { encryptData, decryptData } = require('../utils/encryption');
const { isRateLimited } = require('../middleware/rateLimiter');

const router = express.Router();

// Rate limiting pour les routes d'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: {
    error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation des données d'entrée
const loginValidation = [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Nom d\'utilisateur invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court'),
  body('totpCode').optional().isLength({ min: 6, max: 6 }).withMessage('Code 2FA invalide')
];

const registerValidation = [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Nom d\'utilisateur invalide'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 8 }).withMessage('Mot de passe doit contenir au moins 8 caractères'),
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('Prénom invalide'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Nom invalide')
];

// Route de connexion
router.post('/login', authLimiter, loginValidation, async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const { username, password, totpCode } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    // Vérifier le rate limiting
    if (await isRateLimited(clientIP, 'login')) {
      await createAuditLog('LOGIN_ATTEMPT', 'FAILED', {
        username,
        ip: clientIP,
        reason: 'Rate limited'
      });
      
      return res.status(429).json({
        error: 'Trop de tentatives. Réessayez plus tard.',
        code: 'RATE_LIMITED'
      });
    }

    // Récupérer l'utilisateur depuis la base de données
    const db = req.app.locals.db;
    const user = await db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (!user) {
      await createAuditLog('LOGIN_ATTEMPT', 'FAILED', {
        username,
        ip: clientIP,
        reason: 'User not found'
      });
      
      return res.status(401).json({
        error: 'Identifiants invalides',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      await createAuditLog('LOGIN_ATTEMPT', 'FAILED', {
        username: user.username,
        ip: clientIP,
        reason: 'Invalid password'
      });
      
      return res.status(401).json({
        error: 'Identifiants invalides',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Vérifier si l'utilisateur est activé
    if (!user.is_active) {
      await createAuditLog('LOGIN_ATTEMPT', 'FAILED', {
        username: user.username,
        ip: clientIP,
        reason: 'Account disabled'
      });
      
      return res.status(403).json({
        error: 'Compte désactivé',
        code: 'ACCOUNT_DISABLED'
      });
    }

    // Vérifier le code 2FA si activé
    if (user.two_factor_enabled) {
      if (!totpCode) {
        return res.status(400).json({
          error: 'Code 2FA requis',
          code: 'TOTP_REQUIRED',
          requires2FA: true
        });
      }

      const isValidTOTP = verifyTOTP(user.two_factor_secret, totpCode);
      if (!isValidTOTP) {
        await createAuditLog('LOGIN_ATTEMPT', 'FAILED', {
          username: user.username,
          ip: clientIP,
          reason: 'Invalid 2FA code'
        });
        
        return res.status(401).json({
          error: 'Code 2FA invalide',
          code: 'INVALID_TOTP'
        });
      }
    }

    // Générer le token JWT
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      permissions: JSON.parse(user.permissions || '[]')
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
      issuer: 'kheops-set-digital',
      audience: 'admin-panel'
    });

    // Mettre à jour les informations de connexion
    await db.run(
      'UPDATE users SET last_login = ?, login_count = login_count + 1 WHERE id = ?',
      [new Date().toISOString(), user.id]
    );

    // Créer le log d'audit
    await createAuditLog('LOGIN', 'SUCCESS', {
      username: user.username,
      ip: clientIP,
      userId: user.id
    });

    // Réponse sécurisée
    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        permissions: JSON.parse(user.permissions || '[]'),
        twoFactorEnabled: user.two_factor_enabled,
        lastLogin: user.last_login
      },
      expiresIn: process.env.JWT_EXPIRES_IN || '2h'
    });

  } catch (error) {
    console.error('Erreur de connexion:', error);
    
    await createAuditLog('LOGIN_ATTEMPT', 'ERROR', {
      username: req.body.username,
      ip: req.ip || req.connection.remoteAddress,
      error: error.message
    });
    
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Route d'enregistrement (pour les administrateurs)
router.post('/register', authLimiter, registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const { username, email, password, firstName, lastName, role = 'user' } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    const db = req.app.locals.db;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.get(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      return res.status(409).json({
        error: 'Utilisateur déjà existant',
        code: 'USER_EXISTS'
      });
    }

    // Hasher le mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Générer la clé secrète 2FA
    const twoFactorSecret = generateTOTP();

    // Insérer le nouvel utilisateur
    const result = await db.run(
      `INSERT INTO users (
        username, email, password, first_name, last_name, 
        role, permissions, two_factor_secret, is_active, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        email,
        hashedPassword,
        firstName,
        lastName,
        role,
        JSON.stringify(['read', 'write']), // Permissions par défaut
        twoFactorSecret,
        1, // Actif par défaut
        new Date().toISOString(),
        new Date().toISOString()
      ]
    );

    const userId = result.lastID;

    // Créer le log d'audit
    await createAuditLog('USER_REGISTERED', 'SUCCESS', {
      username,
      email,
      ip: clientIP,
      userId,
      role
    });

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: {
        id: userId,
        username,
        email,
        firstName,
        lastName,
        role,
        twoFactorSecret // À supprimer en production
      }
    });

  } catch (error) {
    console.error('Erreur d\'enregistrement:', error);
    
    await createAuditLog('USER_REGISTERED', 'ERROR', {
      username: req.body.username,
      email: req.body.email,
      ip: req.ip || req.connection.remoteAddress,
      error: error.message
    });
    
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Route de vérification du token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token manquant',
        code: 'MISSING_TOKEN'
      });
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'kheops-set-digital',
      audience: 'admin-panel'
    });

    // Vérifier si l'utilisateur existe toujours
    const db = req.app.locals.db;
    const user = await db.get(
      'SELECT id, username, email, first_name, last_name, role, permissions, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user || !user.is_active) {
      return res.status(401).json({
        error: 'Token invalide',
        code: 'INVALID_TOKEN'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        permissions: JSON.parse(user.permissions || '[]')
      }
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expiré',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token invalide',
        code: 'INVALID_TOKEN'
      });
    }

    console.error('Erreur de vérification du token:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Route de déconnexion
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Ajouter le token à une liste noire (optionnel)
      // Pour une implémentation complète, vous pourriez utiliser Redis
      
      await createAuditLog('LOGOUT', 'SUCCESS', {
        ip: req.ip || req.connection.remoteAddress
      });
    }

    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });

  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Route de rafraîchissement du token
router.post('/refresh', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token manquant',
        code: 'MISSING_TOKEN'
      });
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'kheops-set-digital',
      audience: 'admin-panel',
      ignoreExpiration: true // Permettre les tokens expirés pour le rafraîchissement
    });

    // Vérifier si l'utilisateur existe toujours
    const db = req.app.locals.db;
    const user = await db.get(
      'SELECT id, username, role, permissions, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user || !user.is_active) {
      return res.status(401).json({
        error: 'Token invalide',
        code: 'INVALID_TOKEN'
      });
    }

    // Générer un nouveau token
    const newTokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      permissions: JSON.parse(user.permissions || '[]')
    };

    const newToken = jwt.sign(newTokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
      issuer: 'kheops-set-digital',
      audience: 'admin-panel'
    });

    await createAuditLog('TOKEN_REFRESHED', 'SUCCESS', {
      username: user.username,
      ip: req.ip || req.connection.remoteAddress
    });

    res.json({
      success: true,
      token: newToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '2h'
    });

  } catch (error) {
    console.error('Erreur de rafraîchissement du token:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router; 