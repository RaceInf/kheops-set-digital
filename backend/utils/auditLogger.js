const fs = require('fs').promises;
const path = require('path');

// Types d'événements d'audit
const AUDIT_EVENTS = {
  // Authentification
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LOGIN_ATTEMPT: 'LOGIN_ATTEMPT',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',
  
  // Gestion des utilisateurs
  USER_REGISTERED: 'USER_REGISTERED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
  
  // Sécurité
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  RATE_LIMIT_BLOCKED: 'RATE_LIMIT_BLOCKED',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  
  // Articles
  ARTICLE_CREATED: 'ARTICLE_CREATED',
  ARTICLE_UPDATED: 'ARTICLE_UPDATED',
  ARTICLE_DELETED: 'ARTICLE_DELETED',
  ARTICLE_PUBLISHED: 'ARTICLE_PUBLISHED',
  
  // Requêtes authentifiées
  AUTHENTICATED_REQUEST: 'AUTHENTICATED_REQUEST'
};

// Niveaux de sévérité
const SEVERITY_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  SECURITY: 'SECURITY',
  CRITICAL: 'CRITICAL'
};

// Créer un log d'audit
const createAuditLog = async (event, status, details = {}) => {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event,
      status,
      details,
      environment: process.env.NODE_ENV || 'development'
    };

    // Ajouter des métadonnées si disponibles
    if (details.ip) {
      logEntry.ip = details.ip;
    }
    if (details.username) {
      logEntry.username = details.username;
    }
    if (details.userId) {
      logEntry.userId = details.userId;
    }

    // Déterminer le niveau de sévérité
    let severity = SEVERITY_LEVELS.INFO;
    
    if (event.includes('SECURITY') || event.includes('UNAUTHORIZED') || 
        event.includes('SUSPICIOUS') || event.includes('RATE_LIMIT')) {
      severity = SEVERITY_LEVELS.SECURITY;
    } else if (status === 'FAILED' || status === 'ERROR') {
      severity = SEVERITY_LEVELS.ERROR;
    } else if (status === 'WARNING') {
      severity = SEVERITY_LEVELS.WARNING;
    }

    logEntry.severity = severity;

    // Créer le message de log
    const logMessage = JSON.stringify(logEntry) + '\n';

    // Écrire dans le fichier de log
    const logDir = path.join(__dirname, '..', 'logs');
    const logFile = path.join(logDir, `audit-${new Date().toISOString().split('T')[0]}.log`);

    // Créer le répertoire de logs s'il n'existe pas
    try {
      await fs.mkdir(logDir, { recursive: true });
    } catch (error) {
      // Le répertoire existe déjà
    }

    // Écrire le log de manière asynchrone
    fs.appendFile(logFile, logMessage).catch(error => {
      console.error('Erreur lors de l\'écriture du log d\'audit:', error);
    });

    // Log dans la console pour les événements critiques
    if (severity === SEVERITY_LEVELS.SECURITY || severity === SEVERITY_LEVELS.CRITICAL) {
      console.warn(`[AUDIT ${severity}] ${event}: ${status}`, details);
    }

    // Optionnel : envoyer une alerte pour les événements critiques
    if (severity === SEVERITY_LEVELS.CRITICAL) {
      await sendSecurityAlert(logEntry);
    }

    return logEntry;

  } catch (error) {
    console.error('Erreur lors de la création du log d\'audit:', error);
    return null;
  }
};

// Envoyer une alerte de sécurité
const sendSecurityAlert = async (logEntry) => {
  try {
    // En production, vous pourriez envoyer un email, SMS, ou notification Slack
    console.error('🚨 ALERTE DE SÉCURITÉ CRITIQUE:', logEntry);
    
    // Exemple d'envoi d'email (nécessite un service SMTP)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // await sendEmail({
      //   to: process.env.ADMIN_EMAIL,
      //   subject: `Alerte de sécurité - ${logEntry.event}`,
      //   body: JSON.stringify(logEntry, null, 2)
      // });
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'alerte de sécurité:', error);
  }
};

// Récupérer les logs d'audit
const getAuditLogs = async (options = {}) => {
  try {
    const {
      startDate,
      endDate,
      event,
      username,
      severity,
      limit = 100,
      offset = 0
    } = options;

    const logDir = path.join(__dirname, '..', 'logs');
    const logs = [];

    // Lire les fichiers de log dans la plage de dates
    const files = await fs.readdir(logDir);
    const logFiles = files.filter(file => file.startsWith('audit-') && file.endsWith('.log'));

    for (const file of logFiles) {
      const filePath = path.join(logDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      
      const lines = content.trim().split('\n');
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        try {
          const logEntry = JSON.parse(line);
          
          // Filtrer par date
          if (startDate && new Date(logEntry.timestamp) < new Date(startDate)) continue;
          if (endDate && new Date(logEntry.timestamp) > new Date(endDate)) continue;
          
          // Filtrer par événement
          if (event && logEntry.event !== event) continue;
          
          // Filtrer par utilisateur
          if (username && logEntry.username !== username) continue;
          
          // Filtrer par sévérité
          if (severity && logEntry.severity !== severity) continue;
          
          logs.push(logEntry);
        } catch (error) {
          console.error('Erreur lors du parsing du log:', error);
        }
      }
    }

    // Trier par timestamp (plus récent en premier)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pagination
    const paginatedLogs = logs.slice(offset, offset + limit);

    return {
      logs: paginatedLogs,
      total: logs.length,
      limit,
      offset
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des logs d\'audit:', error);
    return { logs: [], total: 0, limit, offset: 0 };
  }
};

// Statistiques des logs d'audit
const getAuditStats = async (options = {}) => {
  try {
    const { startDate, endDate } = options;
    const logs = await getAuditLogs({ startDate, endDate, limit: 10000 });

    const stats = {
      total: logs.total,
      byEvent: {},
      bySeverity: {},
      byStatus: {},
      byUser: {},
      timeline: {}
    };

    logs.logs.forEach(log => {
      // Par événement
      stats.byEvent[log.event] = (stats.byEvent[log.event] || 0) + 1;
      
      // Par sévérité
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;
      
      // Par statut
      stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1;
      
      // Par utilisateur
      if (log.username) {
        stats.byUser[log.username] = (stats.byUser[log.username] || 0) + 1;
      }
      
      // Timeline (par jour)
      const day = log.timestamp.split('T')[0];
      stats.timeline[day] = (stats.timeline[day] || 0) + 1;
    });

    return stats;

  } catch (error) {
    console.error('Erreur lors du calcul des statistiques d\'audit:', error);
    return {
      total: 0,
      byEvent: {},
      bySeverity: {},
      byStatus: {},
      byUser: {},
      timeline: {}
    };
  }
};

// Nettoyer les anciens logs
const cleanupOldLogs = async (daysToKeep = 30) => {
  try {
    const logDir = path.join(__dirname, '..', 'logs');
    const files = await fs.readdir(logDir);
    const logFiles = files.filter(file => file.startsWith('audit-') && file.endsWith('.log'));

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    let deletedCount = 0;

    for (const file of logFiles) {
      const filePath = path.join(logDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.mtime < cutoffDate) {
        await fs.unlink(filePath);
        deletedCount++;
      }
    }

    console.log(`Nettoyage des logs: ${deletedCount} fichiers supprimés`);
    return deletedCount;

  } catch (error) {
    console.error('Erreur lors du nettoyage des logs:', error);
    return 0;
  }
};

module.exports = {
  createAuditLog,
  getAuditLogs,
  getAuditStats,
  cleanupOldLogs,
  AUDIT_EVENTS,
  SEVERITY_LEVELS
}; 