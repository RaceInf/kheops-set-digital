const express = require('express');
const { authenticateToken, requireRole, logAuthenticatedRequest } = require('../middleware/auth');
const { createAuditLog, getAuditLogs, getAuditStats, cleanupOldLogs } = require('../utils/auditLogger');
const { encryptData, decryptData } = require('../utils/encryption');

const router = express.Router();

// Toutes les routes admin nécessitent le rôle admin
router.use(authenticateToken);
router.use(requireRole('admin'));
router.use(logAuthenticatedRequest);

// GET /api/admin/dashboard - Tableau de bord administrateur
router.get('/dashboard', async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Statistiques des utilisateurs
    const userStats = await db.get(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users,
        COUNT(CASE WHEN two_factor_enabled = 1 THEN 1 END) as users_with_2fa,
        COUNT(CASE WHEN last_login > datetime('now', '-7 days') THEN 1 END) as recent_logins
      FROM users
    `);

    // Statistiques des articles
    const articleStats = await db.get(`
      SELECT 
        COUNT(*) as total_articles,
        COUNT(CASE WHEN status = 'published' THEN 1 END) as published_articles,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_articles,
        COUNT(CASE WHEN created_at > datetime('now', '-7 days') THEN 1 END) as recent_articles
      FROM articles
    `);

    // Statistiques des sessions
    const sessionStats = await db.get(`
      SELECT 
        COUNT(*) as active_sessions,
        COUNT(CASE WHEN expires_at > datetime('now') THEN 1 END) as valid_sessions
      FROM sessions
    `);

    // Tentatives de connexion récentes
    const recentLoginAttempts = await db.all(`
      SELECT 
        username, ip_address, success, created_at
      FROM login_attempts 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    // Logs d'audit récents
    const recentAuditLogs = await db.all(`
      SELECT 
        event, status, severity, username, ip_address, created_at
      FROM audit_logs 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    // Paramètres système
    const systemSettings = await db.all(`
      SELECT key, value, encrypted, description 
      FROM system_settings
    `);

    // Décrypter les valeurs chiffrées
    const decryptedSettings = systemSettings.map(setting => ({
      ...setting,
      value: setting.encrypted ? decryptData(setting.value) : setting.value
    }));

    // Log de l'action
    await createAuditLog('ADMIN_DASHBOARD_ACCESSED', 'SUCCESS', {
      user_id: req.user.userId,
      username: req.user.username,
      ip: req.ip || req.connection.remoteAddress
    });

    res.json({
      success: true,
      data: {
        userStats,
        articleStats,
        sessionStats,
        recentLoginAttempts,
        recentAuditLogs,
        systemSettings: decryptedSettings
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'accès au tableau de bord:', error);
    
    await createAuditLog('ADMIN_DASHBOARD_ACCESSED', 'ERROR', {
      user_id: req.user?.userId,
      username: req.user?.username,
      ip: req.ip || req.connection.remoteAddress,
      error: error.message
    });

    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/admin/users - Liste des utilisateurs
router.get('/users', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { page = 1, limit = 20, search, role, status } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    if (status !== undefined) {
      whereClause += ' AND is_active = ?';
      params.push(status === 'active' ? 1 : 0);
    }

    // Compter le total
    const countResult = await db.get(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );
    const total = countResult.total;

    // Récupérer les utilisateurs
    const users = await db.all(
      `SELECT 
        id, username, email, first_name, last_name, role, permissions,
        two_factor_enabled, is_active, login_count, last_login,
        failed_login_attempts, locked_until, created_at, updated_at
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Masquer les informations sensibles
    const sanitizedUsers = users.map(user => ({
      ...user,
      permissions: JSON.parse(user.permissions || '[]'),
      password: undefined // Ne pas inclure le mot de passe
    }));

    res.json({
      success: true,
      data: sanitizedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

// PUT /api/admin/users/:id - Mettre à jour un utilisateur
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      first_name, 
      last_name, 
      role, 
      permissions, 
      is_active,
      two_factor_enabled 
    } = req.body;

    const db = req.app.locals.db;

    // Vérifier si l'utilisateur existe
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    // Mettre à jour l'utilisateur
    await db.run(
      `UPDATE users SET
        first_name = ?, last_name = ?, role = ?, permissions = ?,
        is_active = ?, two_factor_enabled = ?, updated_at = ?
      WHERE id = ?`,
      [
        first_name || user.first_name,
        last_name || user.last_name,
        role || user.role,
        JSON.stringify(permissions || JSON.parse(user.permissions || '[]')),
        is_active !== undefined ? is_active : user.is_active,
        two_factor_enabled !== undefined ? two_factor_enabled : user.two_factor_enabled,
        new Date().toISOString(),
        id
      ]
    );

    await createAuditLog('USER_UPDATED', 'SUCCESS', {
      user_id: req.user.userId,
      username: req.user.username,
      ip: req.ip || req.connection.remoteAddress,
      target_user_id: id,
      changes: req.body
    });

    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

// DELETE /api/admin/users/:id - Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    // Empêcher la suppression de l'utilisateur actuel
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({
        error: 'Vous ne pouvez pas supprimer votre propre compte',
        code: 'SELF_DELETE_NOT_ALLOWED'
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    // Supprimer l'utilisateur
    await db.run('DELETE FROM users WHERE id = ?', [id]);

    await createAuditLog('USER_DELETED', 'SUCCESS', {
      user_id: req.user.userId,
      username: req.user.username,
      ip: req.ip || req.connection.remoteAddress,
      target_user_id: id,
      target_username: user.username
    });

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/admin/audit-logs - Logs d'audit
router.get('/audit-logs', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      event, 
      severity, 
      username,
      startDate,
      endDate 
    } = req.query;

    const options = {
      startDate,
      endDate,
      event,
      severity,
      username,
      limit: parseInt(limit),
      offset: (page - 1) * parseInt(limit)
    };

    const logs = await getAuditLogs(options);

    res.json({
      success: true,
      data: logs
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des logs d\'audit:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/admin/audit-stats - Statistiques d'audit
router.get('/audit-stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await getAuditStats({ startDate, endDate });

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques d\'audit:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/admin/cleanup-logs - Nettoyer les anciens logs
router.post('/cleanup-logs', async (req, res) => {
  try {
    const { daysToKeep = 30 } = req.body;
    const deletedCount = await cleanupOldLogs(daysToKeep);

    await createAuditLog('LOGS_CLEANUP', 'SUCCESS', {
      user_id: req.user.userId,
      username: req.user.username,
      ip: req.ip || req.connection.remoteAddress,
      daysToKeep,
      deletedCount
    });

    res.json({
      success: true,
      message: `${deletedCount} fichiers de logs supprimés`,
      deletedCount
    });

  } catch (error) {
    console.error('Erreur lors du nettoyage des logs:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

// PUT /api/admin/settings - Mettre à jour les paramètres système
router.put('/settings', async (req, res) => {
  try {
    const { settings } = req.body;
    const db = req.app.locals.db;

    for (const [key, value] of Object.entries(settings)) {
      // Déterminer si la valeur doit être chiffrée
      const isEncrypted = ['encryption_key', 'api_keys'].includes(key);
      const finalValue = isEncrypted ? encryptData(value) : value;

      await db.run(
        `INSERT OR REPLACE INTO system_settings (key, value, encrypted, updated_at)
         VALUES (?, ?, ?, ?)`,
        [key, finalValue, isEncrypted ? 1 : 0, new Date().toISOString()]
      );
    }

    await createAuditLog('SYSTEM_SETTINGS_UPDATED', 'SUCCESS', {
      user_id: req.user.userId,
      username: req.user.username,
      ip: req.ip || req.connection.remoteAddress,
      updatedSettings: Object.keys(settings)
    });

    res.json({
      success: true,
      message: 'Paramètres système mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/admin/backup - Créer une sauvegarde
router.post('/backup', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const fs = require('fs');
    const path = require('path');

    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}.db`);

    await db.backup(backupPath);

    await createAuditLog('DATABASE_BACKUP', 'SUCCESS', {
      user_id: req.user.userId,
      username: req.user.username,
      ip: req.ip || req.connection.remoteAddress,
      backupPath
    });

    res.json({
      success: true,
      message: 'Sauvegarde créée avec succès',
      backupPath
    });

  } catch (error) {
    console.error('Erreur lors de la création de la sauvegarde:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router; 