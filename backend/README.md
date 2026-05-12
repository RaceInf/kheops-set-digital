# 🔒 Backend Sécurisé KHEOPS SET DIGITAL

Backend Express.js avec sécurité de niveau production pour l'administration de KHEOPS SET DIGITAL.

## 🚀 Fonctionnalités de Sécurité

### 🔐 Authentification & Autorisation
- **JWT (JSON Web Tokens)** avec expiration automatique
- **Authentification à deux facteurs (2FA)** avec TOTP
- **Gestion des rôles et permissions** granulaires
- **Sessions sécurisées** avec refresh automatique
- **Protection contre les attaques par force brute**

### 🛡️ Sécurité Avancée
- **Helmet.js** pour les en-têtes de sécurité
- **CORS** configuré de manière sécurisée
- **Rate limiting** intelligent
- **Chiffrement des données sensibles**
- **Audit logging** complet
- **HTTPS/SSL** avec certificats automatiques

### 📊 Monitoring & Logs
- **Logs d'audit** détaillés
- **Statistiques de sécurité**
- **Monitoring des tentatives d'intrusion**
- **Backup automatique** de la base de données

## 📋 Prérequis

- Node.js >= 18.0.0
- npm >= 8.0.0
- SQLite3 (inclus)

## 🛠️ Installation

1. **Cloner le projet**
```bash
cd backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
cp env.example .env
```

4. **Éditer le fichier .env**
```bash
# Générer des clés sécurisées
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
ENCRYPTION_KEY=your-32-character-encryption-key-here
```

5. **Démarrer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 🔧 Configuration

### Variables d'Environnement

```env
# Configuration du serveur
NODE_ENV=development
PORT=3001
HTTPS_PORT=3443

# Sécurité
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=2h
ENCRYPTION_KEY=your-32-character-encryption-key

# Frontend URL (pour CORS)
FRONTEND_URL=https://localhost:8081

# Certificats SSL (optionnel)
SSL_CERT_PATH=./ssl/cert.pem
SSL_KEY_PATH=./ssl/key.pem
```

### Génération de Clés Sécurisées

```bash
# JWT Secret (64 caractères minimum)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Encryption Key (32 caractères)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🔐 Authentification

### Création d'un Compte Admin

L'utilisateur admin est créé automatiquement lors de la première initialisation :

- **Username:** `admin`
- **Password:** `admin123`
- **Role:** `admin`

⚠️ **Important:** Changez le mot de passe immédiatement après la première connexion !

### Endpoints d'Authentification

```bash
# Connexion
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123",
  "totpCode": "123456"  # Si 2FA activé
}

# Vérification du token
GET /api/auth/verify
Authorization: Bearer <token>

# Rafraîchissement du token
POST /api/auth/refresh
Authorization: Bearer <token>

# Déconnexion
POST /api/auth/logout
Authorization: Bearer <token>
```

## 📝 API Articles

### Endpoints

```bash
# Liste des articles
GET /api/articles?page=1&limit=10&status=published

# Article par ID
GET /api/articles/:id

# Créer un article
POST /api/articles
Authorization: Bearer <token>
{
  "title": "Mon Article",
  "content": "Contenu de l'article...",
  "status": "draft"
}

# Mettre à jour un article
PUT /api/articles/:id
Authorization: Bearer <token>

# Supprimer un article
DELETE /api/articles/:id
Authorization: Bearer <token>

# Publier un article
PATCH /api/articles/:id/publish
Authorization: Bearer <token>
```

## 👨‍💼 Administration

### Endpoints Admin

```bash
# Tableau de bord
GET /api/admin/dashboard
Authorization: Bearer <token>

# Liste des utilisateurs
GET /api/admin/users?page=1&limit=20

# Mettre à jour un utilisateur
PUT /api/admin/users/:id
Authorization: Bearer <token>

# Logs d'audit
GET /api/admin/audit-logs?page=1&limit=50

# Statistiques d'audit
GET /api/admin/audit-stats

# Sauvegarde
POST /api/admin/backup
Authorization: Bearer <token>
```

## 🔍 Logs d'Audit

Les logs d'audit sont automatiquement générés pour :

- ✅ Connexions/déconnexions
- ✅ Création/modification/suppression d'articles
- ✅ Tentatives d'accès non autorisées
- ✅ Erreurs de sécurité
- ✅ Modifications des paramètres système

### Types d'Événements

- `LOGIN` / `LOGOUT`
- `ARTICLE_CREATED` / `ARTICLE_UPDATED` / `ARTICLE_DELETED`
- `USER_REGISTERED` / `USER_UPDATED` / `USER_DELETED`
- `UNAUTHORIZED_ACCESS`
- `RATE_LIMIT_BLOCKED`
- `SECURITY_ERROR`

## 🛡️ Sécurité

### Protection contre les Attaques

1. **Rate Limiting**
   - 5 tentatives de connexion par IP/15 minutes
   - 100 requêtes API par IP/15 minutes

2. **Validation des Données**
   - Validation stricte des entrées
   - Protection contre l'injection SQL
   - Sanitisation des données

3. **Chiffrement**
   - Mots de passe hashés avec bcrypt
   - Données sensibles chiffrées
   - Communication HTTPS

4. **Monitoring**
   - Détection d'activité suspecte
   - Logs de sécurité en temps réel
   - Alertes automatiques

## 📊 Base de Données

### Structure

```sql
-- Utilisateurs
users (id, username, email, password, role, permissions, 2fa, ...)

-- Articles
articles (id, title, slug, content, author_id, status, ...)

-- Logs d'audit
audit_logs (id, event, status, user_id, ip_address, ...)

-- Sessions
sessions (id, user_id, token, expires_at, ...)

-- Tentatives de connexion
login_attempts (id, username, ip_address, success, ...)

-- Paramètres système
system_settings (id, key, value, encrypted, ...)
```

### Sauvegarde

```bash
# Sauvegarde manuelle
npm run backup

# Sauvegarde automatique (cron)
0 2 * * * cd /path/to/backend && npm run backup
```

## 🚀 Déploiement

### Production

1. **Variables d'environnement**
```bash
NODE_ENV=production
JWT_SECRET=<clé-sécurisée>
ENCRYPTION_KEY=<clé-chiffrement>
```

2. **Certificats SSL**
```bash
# Générer des certificats SSL
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes
```

3. **Démarrer en production**
```bash
npm start
```

### Docker (optionnel)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔧 Scripts Utilitaires

```bash
# Installation complète
npm run setup

# Migration de base de données
npm run migrate

# Sauvegarde
npm run backup

# Tests
npm test

# Linting
npm run lint
```

## 📞 Support

Pour toute question ou problème de sécurité :

- 📧 Email: admin@kheops-set-digital.com
- 🔒 Signalement de vulnérabilités: security@kheops-set-digital.com

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

---

**⚠️ Sécurité:** Ce backend implémente des fonctionnalités de sécurité de niveau production. Assurez-vous de changer toutes les clés par défaut avant la mise en production. 