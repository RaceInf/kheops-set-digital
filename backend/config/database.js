const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { encryptData, decryptData } = require('../utils/encryption');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '..', 'data', 'kheops.db');
  }

  // Initialiser la base de données
  async initialize() {
    try {
      // Créer le répertoire de données s'il n'existe pas
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Créer la connexion à la base de données
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Erreur lors de la connexion à la base de données:', err);
          throw err;
        }
        console.log('✅ Connexion à la base de données SQLite établie');
      });

      // Activer les contraintes de clés étrangères
      await this.run('PRAGMA foreign_keys = ON');
      
      // Activer le mode WAL pour de meilleures performances
      await this.run('PRAGMA journal_mode = WAL');
      
      // Créer les tables
      await this.createTables();
      
      // Insérer les données initiales
      await this.insertInitialData();
      
      console.log('✅ Base de données initialisée avec succès');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
      throw error;
    }
  }

  // Créer les tables
  async createTables() {
    const tables = [
      // Table des utilisateurs
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        permissions TEXT DEFAULT '[]',
        two_factor_secret VARCHAR(50),
        two_factor_enabled BOOLEAN DEFAULT 0,
        recovery_codes TEXT,
        is_active BOOLEAN DEFAULT 1,
        login_count INTEGER DEFAULT 0,
        last_login DATETIME,
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table des articles
      `CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image VARCHAR(500),
        author_id INTEGER,
        status VARCHAR(20) DEFAULT 'draft',
        seo_title VARCHAR(255),
        seo_description TEXT,
        seo_keywords TEXT,
        published_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL
      )`,

      // Table des logs d'audit
      `CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL,
        severity VARCHAR(20) DEFAULT 'INFO',
        user_id INTEGER,
        username VARCHAR(50),
        ip_address VARCHAR(45),
        user_agent TEXT,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
      )`,

      // Table des sessions
      `CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )`,

      // Table des tentatives de connexion
      `CREATE TABLE IF NOT EXISTS login_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        success BOOLEAN DEFAULT 0,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table des paramètres système
      `CREATE TABLE IF NOT EXISTS system_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key VARCHAR(100) UNIQUE NOT NULL,
        value TEXT,
        encrypted BOOLEAN DEFAULT 0,
        description TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const table of tables) {
      await this.run(table);
    }

    // Créer les index pour les performances
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)',
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)',
      'CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status)',
      'CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON audit_logs(event)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)',
      'CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address)',
      'CREATE INDEX IF NOT EXISTS idx_login_attempts_created ON login_attempts(created_at)'
    ];

    for (const index of indexes) {
      await this.run(index);
    }
  }

  // Insérer les données initiales
  async insertInitialData() {
    try {
      // Vérifier si l'admin existe déjà
      const adminExists = await this.get('SELECT id FROM users WHERE username = ?', ['admin']);
      
      if (!adminExists) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 12);
        
        // Créer l'utilisateur admin
        await this.run(`
          INSERT INTO users (
            username, email, password, first_name, last_name, 
            role, permissions, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          'admin',
          'admin@kheops-set-digital.com',
          hashedPassword,
          'Administrateur',
          'Système',
          'admin',
          JSON.stringify(['read', 'write', 'delete', 'admin']),
          1
        ]);

        console.log('👤 Utilisateur admin créé (admin/admin123)');
      }

      // Insérer les paramètres système par défaut
      const settings = [
        ['site_name', 'KHEOPS SET DIGITAL', 0, 'Nom du site'],
        ['site_description', 'Agence de marketing digital', 0, 'Description du site'],
        ['maintenance_mode', 'false', 0, 'Mode maintenance'],
        ['max_login_attempts', '5', 0, 'Nombre maximum de tentatives de connexion'],
        ['session_timeout', '7200', 0, 'Timeout de session en secondes'],
        ['encryption_key', encryptData(process.env.ENCRYPTION_KEY || 'default-key'), 1, 'Clé de chiffrement']
      ];

      for (const [key, value, encrypted, description] of settings) {
        await this.run(`
          INSERT OR IGNORE INTO system_settings (key, value, encrypted, description)
          VALUES (?, ?, ?, ?)
        `, [key, value, encrypted, description]);
      }

    } catch (error) {
      console.error('Erreur lors de l\'insertion des données initiales:', error);
    }
  }

  // Méthodes utilitaires pour la base de données
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Fermer la connexion
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ Connexion à la base de données fermée');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // Sauvegarder la base de données
  async backup(backupPath) {
    try {
      const backupDb = new sqlite3.Database(backupPath);
      
      return new Promise((resolve, reject) => {
        this.db.backup(backupDb, (err) => {
          backupDb.close();
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }
}

module.exports = Database; 