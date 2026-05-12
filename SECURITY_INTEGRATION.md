# 🔒 Intégration Sécurisée Frontend-Backend

## Vue d'ensemble

KHEOPS SET DIGITAL dispose maintenant d'une architecture sécurisée de niveau production avec :

- **Backend Express.js** avec sécurité avancée
- **Frontend React** avec authentification sécurisée
- **Base de données SQLite** avec chiffrement
- **API REST** avec JWT et 2FA
- **Logs d'audit** complets

## 🏗️ Architecture

```
┌─────────────────┐    HTTPS    ┌─────────────────┐    SQLite    ┌─────────────────┐
│   Frontend      │ ──────────► │   Backend       │ ──────────► │   Base de       │
│   React         │             │   Express.js    │             │   Données       │
│                 │             │                 │             │   Chiffrée      │
└─────────────────┘             └─────────────────┘             └─────────────────┘
        │                                │                                │
        │                                │                                │
        ▼                                ▼                                ▼
┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
│   JWT Token     │             │   Rate Limiting │             │   Audit Logs    │
│   LocalStorage  │             │   Helmet.js     │             │   Encryption    │
│   Session Mgmt  │             │   CORS          │             │   Backups       │
└─────────────────┘             └─────────────────┘             └─────────────────┘
```

## 🔐 Fonctionnalités de Sécurité

### 1. Authentification JWT
- **Tokens sécurisés** avec expiration automatique
- **Refresh automatique** des tokens
- **Stockage sécurisé** dans localStorage
- **Validation côté serveur** à chaque requête

### 2. Authentification à Deux Facteurs (2FA)
- **TOTP (Time-based One-Time Password)**
- **Codes QR** pour applications mobiles
- **Codes de récupération** en cas de perte
- **Activation/désactivation** par utilisateur

### 3. Protection contre les Attaques
- **Rate limiting** intelligent
- **Protection contre la force brute**
- **Validation stricte** des entrées
- **Sanitisation** des données
- **Headers de sécurité** (Helmet.js)

### 4. Chiffrement et Sécurité des Données
- **Mots de passe hashés** avec bcrypt
- **Données sensibles chiffrées** en base
- **Communication HTTPS** obligatoire
- **Clés de chiffrement** sécurisées

### 5. Audit et Monitoring
- **Logs d'audit** détaillés
- **Suivi des tentatives d'intrusion**
- **Statistiques de sécurité**
- **Alertes automatiques**

## 🚀 Démarrage Rapide

### 1. Backend

```bash
cd backend
npm install
cp env.example .env
# Éditer .env avec vos clés sécurisées
npm start
```

### 2. Frontend

```bash
# Dans un autre terminal
npm run dev
```

### 3. Première Connexion

- **URL:** `https://localhost:8081/admin`
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Changez le mot de passe immédiatement !

## 📡 API Endpoints

### Authentification
```bash
POST /api/auth/login          # Connexion
GET  /api/auth/verify         # Vérifier token
POST /api/auth/refresh        # Rafraîchir token
POST /api/auth/logout         # Déconnexion
```

### Articles
```bash
GET    /api/articles          # Liste des articles
GET    /api/articles/:id      # Article par ID
POST   /api/articles          # Créer un article
PUT    /api/articles/:id      # Mettre à jour
DELETE /api/articles/:id      # Supprimer
PATCH  /api/articles/:id/publish # Publier
```

### Administration
```bash
GET  /api/admin/dashboard     # Tableau de bord
GET  /api/admin/users         # Liste utilisateurs
GET  /api/admin/audit-logs    # Logs d'audit
POST /api/admin/backup        # Sauvegarde
```

## 🔧 Configuration

### Variables d'Environnement Backend

```env
# Sécurité
JWT_SECRET=your-64-character-jwt-secret
ENCRYPTION_KEY=your-32-character-encryption-key
JWT_EXPIRES_IN=2h

# Serveur
PORT=3001
HTTPS_PORT=3443
NODE_ENV=production

# Base de données
DB_PATH=./data/kheops.db

# Frontend
FRONTEND_URL=https://yourdomain.com
```

### Variables d'Environnement Frontend

```env
VITE_BACKEND_URL=https://yourdomain.com/api
```

## 🛡️ Sécurité en Production

### 1. Certificats SSL
```bash
# Générer des certificats SSL
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes
```

### 2. Clés Sécurisées
```bash
# JWT Secret (64 caractères)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Encryption Key (32 caractères)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Firewall et Réseau
- **Ports ouverts:** 80, 443, 3001 (backend)
- **CORS configuré** pour votre domaine
- **Rate limiting** activé
- **Headers de sécurité** configurés

### 4. Base de Données
- **Sauvegardes automatiques** quotidiennes
- **Chiffrement** des données sensibles
- **Permissions** restrictives
- **Monitoring** des accès

## 📊 Monitoring et Logs

### Logs d'Audit
Les logs sont automatiquement générés pour :

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

### Accès aux Logs
```bash
# Via l'interface admin
GET /api/admin/audit-logs

# Directement dans les fichiers
tail -f backend/logs/audit-*.log
```

## 🔄 Intégration Frontend

### Service d'Authentification
```typescript
import { authService } from '@/services/authService';

// Connexion
const result = await authService.login({
  username: 'admin',
  password: 'password'
});

// Vérifier l'authentification
if (authService.isAuthenticated()) {
  // Utilisateur connecté
}

// Vérifier les permissions
if (authService.hasPermission('write')) {
  // Peut écrire
}
```

### Service Backend
```typescript
import { backendService } from '@/services/backendService';

// Récupérer les articles
const articles = await backendService.getArticles({
  page: 1,
  limit: 10,
  status: 'published'
});

// Créer un article
const newArticle = await backendService.createArticle({
  title: 'Mon Article',
  content: 'Contenu...',
  status: 'draft'
});
```

### Protection des Routes
```typescript
import ProtectedRoute from '@/components/auth/ProtectedRoute';

<ProtectedRoute 
  requiredPermissions={['write']}
  requiredRole="admin"
>
  <AdminComponent />
</ProtectedRoute>
```

## 🚨 Gestion des Erreurs

### Erreurs d'Authentification
- **401 Unauthorized:** Token manquant ou invalide
- **403 Forbidden:** Permissions insuffisantes
- **429 Too Many Requests:** Rate limit dépassé

### Erreurs de Sécurité
- **Session expirée:** Redirection automatique vers login
- **Token invalide:** Refresh automatique ou déconnexion
- **Accès refusé:** Affichage d'une page d'erreur sécurisée

## 🔧 Maintenance

### Sauvegardes
```bash
# Sauvegarde manuelle
cd backend && npm run backup

# Sauvegarde automatique (cron)
0 2 * * * cd /path/to/backend && npm run backup
```

### Nettoyage des Logs
```bash
# Nettoyer les anciens logs
cd backend && npm run cleanup-logs
```

### Mise à Jour
```bash
# Backend
cd backend && npm update && npm start

# Frontend
npm update && npm run build
```

## 📞 Support Sécurité

Pour toute question ou problème de sécurité :

- 📧 **Email:** security@kheops-set-digital.com
- 🔒 **Signalement de vulnérabilités:** security@kheops-set-digital.com
- 📋 **Documentation complète:** Voir `backend/README.md`

## ✅ Checklist de Sécurité

- [ ] Clés JWT et de chiffrement changées
- [ ] Certificats SSL configurés
- [ ] Firewall configuré
- [ ] Sauvegardes automatiques activées
- [ ] Monitoring des logs configuré
- [ ] Rate limiting activé
- [ ] Headers de sécurité configurés
- [ ] CORS configuré pour votre domaine
- [ ] Mots de passe par défaut changés
- [ ] 2FA activé pour les comptes admin

---

**⚠️ Important:** Cette implémentation fournit une sécurité de niveau production. Assurez-vous de suivre toutes les recommandations de sécurité avant la mise en production. 