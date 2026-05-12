const jwt = require('jsonwebtoken');
const { createAuditLog } = require('../utils/auditLogger');

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return res.status(401).json({
        error: 'Token d\'accès requis',
        code: 'ACCESS_TOKEN_REQUIRED'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'kheops-set-digital',
      audience: 'admin-panel'
    }, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: 'Token expiré',
            code: 'TOKEN_EXPIRED'
          });
        }
        
        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({
            error: 'Token invalide',
            code: 'INVALID_TOKEN'
          });
        }

        return res.status(401).json({
          error: 'Token invalide',
          code: 'INVALID_TOKEN'
        });
      }

      // Ajouter les informations utilisateur à la requête
      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Middleware de vérification des permissions
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentification requise',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }

    const userPermissions = req.user.permissions || [];
    
    if (!userPermissions.includes(permission)) {
      // Log de la tentative d'accès non autorisé
      createAuditLog('UNAUTHORIZED_ACCESS', 'FAILED', {
        username: req.user.username,
        ip: req.ip || req.connection.remoteAddress,
        permission,
        path: req.path,
        method: req.method
      });

      return res.status(403).json({
        error: 'Permission insuffisante',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: permission,
        userPermissions
      });
    }

    next();
  };
};

// Middleware de vérification du rôle
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentification requise',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }

    if (req.user.role !== role && req.user.role !== 'admin') {
      // Log de la tentative d'accès non autorisé
      createAuditLog('UNAUTHORIZED_ACCESS', 'FAILED', {
        username: req.user.username,
        ip: req.ip || req.connection.remoteAddress,
        requiredRole: role,
        userRole: req.user.role,
        path: req.path,
        method: req.method
      });

      return res.status(403).json({
        error: 'Rôle insuffisant',
        code: 'INSUFFICIENT_ROLE',
        required: role,
        userRole: req.user.role
      });
    }

    next();
  };
};

// Middleware de vérification de l'activation 2FA
const require2FA = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentification requise',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }

    const db = req.app.locals.db;
    const user = await db.get(
      'SELECT two_factor_enabled FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (!user) {
      return res.status(401).json({
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!user.two_factor_enabled) {
      return res.status(403).json({
        error: 'Authentification à deux facteurs requise',
        code: '2FA_REQUIRED'
      });
    }

    next();

  } catch (error) {
    console.error('Erreur de vérification 2FA:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Middleware de logging des requêtes authentifiées
const logAuthenticatedRequest = (req, res, next) => {
  if (req.user) {
    // Log de la requête authentifiée
    createAuditLog('AUTHENTICATED_REQUEST', 'SUCCESS', {
      username: req.user.username,
      ip: req.ip || req.connection.remoteAddress,
      path: req.path,
      method: req.method,
      userAgent: req.get('User-Agent')
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requirePermission,
  requireRole,
  require2FA,
  logAuthenticatedRequest
}; 