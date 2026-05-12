const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requirePermission, logAuthenticatedRequest } = require('../middleware/auth');
const { createAuditLog } = require('../utils/auditLogger');
const { encryptData, decryptData } = require('../utils/encryption');

const router = express.Router();

// Validation pour les articles
const articleValidation = [
  body('title').trim().isLength({ min: 5, max: 255 }).withMessage('Titre invalide (5-255 caractères)'),
  body('content').isLength({ min: 100 }).withMessage('Contenu trop court (minimum 100 caractères)'),
  body('excerpt').optional().isLength({ max: 500 }).withMessage('Extrait trop long (maximum 500 caractères)'),
  body('status').isIn(['draft', 'published', 'archived']).withMessage('Statut invalide'),
  body('seo_title').optional().isLength({ max: 255 }).withMessage('Titre SEO trop long'),
  body('seo_description').optional().isLength({ max: 500 }).withMessage('Description SEO trop longue'),
  body('seo_keywords').optional().isLength({ max: 500 }).withMessage('Mots-clés SEO trop longs')
];

// Générer un slug à partir du titre
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[éèê]/g, 'e')
    .replace(/[àâ]/g, 'a')
    .replace(/[ùû]/g, 'u')
    .replace(/[ôö]/g, 'o')
    .replace(/[îï]/g, 'i')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// GET /api/articles - Récupérer tous les articles
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { 
      page = 1, 
      limit = 10, 
      status, 
      author_id, 
      search,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];

    // Filtres
    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (author_id) {
      whereClause += ' AND author_id = ?';
      params.push(author_id);
    }

    if (search) {
      whereClause += ' AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Validation du tri
    const allowedSorts = ['title', 'created_at', 'updated_at', 'published_at', 'status'];
    const allowedOrders = ['ASC', 'DESC'];
    
    const sortField = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = allowedOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

    // Compter le total
    const countResult = await db.get(
      `SELECT COUNT(*) as total FROM articles ${whereClause}`,
      params
    );
    const total = countResult.total;

    // Récupérer les articles
    const articles = await db.all(
      `SELECT 
        a.id, a.title, a.slug, a.excerpt, a.featured_image, 
        a.status, a.seo_title, a.seo_description, a.seo_keywords,
        a.published_at, a.created_at, a.updated_at,
        u.username as author_name, u.first_name, u.last_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      ${whereClause}
      ORDER BY a.${sortField} ${sortOrder}
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Log de l'action
    await createAuditLog('ARTICLES_LISTED', 'SUCCESS', {
      user_id: req.user?.userId,
      username: req.user?.username,
      ip: req.ip || req.connection.remoteAddress,
      filters: { status, author_id, search, page, limit }
    });

    res.json({
      success: true,
      data: articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    
    await createAuditLog('ARTICLES_LISTED', 'ERROR', {
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

// GET /api/articles/:id - Récupérer un article par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    const article = await db.get(
      `SELECT 
        a.*, u.username as author_name, u.first_name, u.last_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ?`,
      [id]
    );

    if (!article) {
      return res.status(404).json({
        error: 'Article non trouvé',
        code: 'ARTICLE_NOT_FOUND'
      });
    }

    // Log de l'action
    await createAuditLog('ARTICLE_VIEWED', 'SUCCESS', {
      user_id: req.user?.userId,
      username: req.user?.username,
      ip: req.ip || req.connection.remoteAddress,
      article_id: id
    });

    res.json({
      success: true,
      data: article
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    
    await createAuditLog('ARTICLE_VIEWED', 'ERROR', {
      user_id: req.user?.userId,
      username: req.user?.username,
      ip: req.ip || req.connection.remoteAddress,
      article_id: req.params.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/articles - Créer un nouvel article
router.post('/', 
  authenticateToken, 
  requirePermission('write'),
  logAuthenticatedRequest,
  articleValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Données invalides',
          details: errors.array()
        });
      }

      const {
        title,
        content,
        excerpt,
        featured_image,
        status = 'draft',
        seo_title,
        seo_description,
        seo_keywords
      } = req.body;

      const db = req.app.locals.db;
      const slug = generateSlug(title);

      // Vérifier si le slug existe déjà
      const existingArticle = await db.get(
        'SELECT id FROM articles WHERE slug = ?',
        [slug]
      );

      if (existingArticle) {
        return res.status(409).json({
          error: 'Un article avec ce titre existe déjà',
          code: 'DUPLICATE_SLUG'
        });
      }

      // Insérer l'article
      const result = await db.run(
        `INSERT INTO articles (
          title, slug, content, excerpt, featured_image,
          author_id, status, seo_title, seo_description, seo_keywords,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          slug,
          content,
          excerpt || null,
          featured_image || null,
          req.user.userId,
          status,
          seo_title || null,
          seo_description || null,
          seo_keywords || null,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      );

      const articleId = result.lastID;

      // Récupérer l'article créé
      const newArticle = await db.get(
        'SELECT * FROM articles WHERE id = ?',
        [articleId]
      );

      // Log de l'action
      await createAuditLog('ARTICLE_CREATED', 'SUCCESS', {
        user_id: req.user.userId,
        username: req.user.username,
        ip: req.ip || req.connection.remoteAddress,
        article_id: articleId,
        title,
        status
      });

      res.status(201).json({
        success: true,
        message: 'Article créé avec succès',
        data: newArticle
      });

    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      
      await createAuditLog('ARTICLE_CREATED', 'ERROR', {
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
  }
);

// PUT /api/articles/:id - Mettre à jour un article
router.put('/:id',
  authenticateToken,
  requirePermission('write'),
  logAuthenticatedRequest,
  articleValidation,
  async (req, res) => {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Données invalides',
          details: errors.array()
        });
      }

      const {
        title,
        content,
        excerpt,
        featured_image,
        status,
        seo_title,
        seo_description,
        seo_keywords
      } = req.body;

      const db = req.app.locals.db;

      // Vérifier si l'article existe
      const existingArticle = await db.get(
        'SELECT * FROM articles WHERE id = ?',
        [id]
      );

      if (!existingArticle) {
        return res.status(404).json({
          error: 'Article non trouvé',
          code: 'ARTICLE_NOT_FOUND'
        });
      }

      // Vérifier les permissions (seul l'auteur ou un admin peut modifier)
      if (existingArticle.author_id !== req.user.userId && req.user.role !== 'admin') {
        await createAuditLog('ARTICLE_UPDATED', 'FAILED', {
          user_id: req.user.userId,
          username: req.user.username,
          ip: req.ip || req.connection.remoteAddress,
          article_id: id,
          reason: 'Insufficient permissions'
        });

        return res.status(403).json({
          error: 'Permission insuffisante',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      // Générer un nouveau slug si le titre a changé
      let slug = existingArticle.slug;
      if (title !== existingArticle.title) {
        slug = generateSlug(title);
        
        // Vérifier si le nouveau slug existe déjà
        const slugExists = await db.get(
          'SELECT id FROM articles WHERE slug = ? AND id != ?',
          [slug, id]
        );

        if (slugExists) {
          return res.status(409).json({
            error: 'Un article avec ce titre existe déjà',
            code: 'DUPLICATE_SLUG'
          });
        }
      }

      // Mettre à jour l'article
      await db.run(
        `UPDATE articles SET
          title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?,
          status = ?, seo_title = ?, seo_description = ?, seo_keywords = ?,
          published_at = CASE WHEN status = 'published' AND published_at IS NULL 
            THEN ? ELSE published_at END,
          updated_at = ?
        WHERE id = ?`,
        [
          title,
          slug,
          content,
          excerpt || null,
          featured_image || null,
          status,
          seo_title || null,
          seo_description || null,
          seo_keywords || null,
          status === 'published' ? new Date().toISOString() : null,
          new Date().toISOString(),
          id
        ]
      );

      // Récupérer l'article mis à jour
      const updatedArticle = await db.get(
        'SELECT * FROM articles WHERE id = ?',
        [id]
      );

      // Log de l'action
      await createAuditLog('ARTICLE_UPDATED', 'SUCCESS', {
        user_id: req.user.userId,
        username: req.user.username,
        ip: req.ip || req.connection.remoteAddress,
        article_id: id,
        title,
        status
      });

      res.json({
        success: true,
        message: 'Article mis à jour avec succès',
        data: updatedArticle
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      
      await createAuditLog('ARTICLE_UPDATED', 'ERROR', {
        user_id: req.user?.userId,
        username: req.user?.username,
        ip: req.ip || req.connection.remoteAddress,
        article_id: req.params.id,
        error: error.message
      });

      res.status(500).json({
        error: 'Erreur interne du serveur',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

// DELETE /api/articles/:id - Supprimer un article
router.delete('/:id',
  authenticateToken,
  requirePermission('delete'),
  logAuthenticatedRequest,
  async (req, res) => {
    try {
      const { id } = req.params;
      const db = req.app.locals.db;

      // Vérifier si l'article existe
      const article = await db.get(
        'SELECT * FROM articles WHERE id = ?',
        [id]
      );

      if (!article) {
        return res.status(404).json({
          error: 'Article non trouvé',
          code: 'ARTICLE_NOT_FOUND'
        });
      }

      // Vérifier les permissions (seul l'auteur ou un admin peut supprimer)
      if (article.author_id !== req.user.userId && req.user.role !== 'admin') {
        await createAuditLog('ARTICLE_DELETED', 'FAILED', {
          user_id: req.user.userId,
          username: req.user.username,
          ip: req.ip || req.connection.remoteAddress,
          article_id: id,
          reason: 'Insufficient permissions'
        });

        return res.status(403).json({
          error: 'Permission insuffisante',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      // Supprimer l'article
      await db.run('DELETE FROM articles WHERE id = ?', [id]);

      // Log de l'action
      await createAuditLog('ARTICLE_DELETED', 'SUCCESS', {
        user_id: req.user.userId,
        username: req.user.username,
        ip: req.ip || req.connection.remoteAddress,
        article_id: id,
        title: article.title
      });

      res.json({
        success: true,
        message: 'Article supprimé avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      
      await createAuditLog('ARTICLE_DELETED', 'ERROR', {
        user_id: req.user?.userId,
        username: req.user?.username,
        ip: req.ip || req.connection.remoteAddress,
        article_id: req.params.id,
        error: error.message
      });

      res.status(500).json({
        error: 'Erreur interne du serveur',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

// PATCH /api/articles/:id/publish - Publier un article
router.patch('/:id/publish',
  authenticateToken,
  requirePermission('write'),
  logAuthenticatedRequest,
  async (req, res) => {
    try {
      const { id } = req.params;
      const db = req.app.locals.db;

      // Vérifier si l'article existe
      const article = await db.get(
        'SELECT * FROM articles WHERE id = ?',
        [id]
      );

      if (!article) {
        return res.status(404).json({
          error: 'Article non trouvé',
          code: 'ARTICLE_NOT_FOUND'
        });
      }

      // Vérifier les permissions
      if (article.author_id !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Permission insuffisante',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      // Publier l'article
      await db.run(
        `UPDATE articles SET 
          status = 'published', 
          published_at = ?, 
          updated_at = ? 
        WHERE id = ?`,
        [new Date().toISOString(), new Date().toISOString(), id]
      );

      // Log de l'action
      await createAuditLog('ARTICLE_PUBLISHED', 'SUCCESS', {
        user_id: req.user.userId,
        username: req.user.username,
        ip: req.ip || req.connection.remoteAddress,
        article_id: id,
        title: article.title
      });

      res.json({
        success: true,
        message: 'Article publié avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la publication de l\'article:', error);
      
      await createAuditLog('ARTICLE_PUBLISHED', 'ERROR', {
        user_id: req.user?.userId,
        username: req.user?.username,
        ip: req.ip || req.connection.remoteAddress,
        article_id: req.params.id,
        error: error.message
      });

      res.status(500).json({
        error: 'Erreur interne du serveur',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

module.exports = router; 