const crypto = require('crypto');

// Clé de chiffrement (en production, utilisez une clé plus sécurisée)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here';
const ALGORITHM = 'aes-256-gcm';

// Chiffrer des données
const encryptData = (text) => {
  try {
    if (!text) return null;

    // Générer un vecteur d'initialisation aléatoire
    const iv = crypto.randomBytes(16);
    
    // Créer le cipher
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    cipher.setAAD(Buffer.from('kheops-set-digital', 'utf8'));
    
    // Chiffrer les données
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Récupérer l'auth tag
    const authTag = cipher.getAuthTag();
    
    // Combiner IV, données chiffrées et auth tag
    const result = iv.toString('hex') + ':' + encrypted + ':' + authTag.toString('hex');
    
    return result;
  } catch (error) {
    console.error('Erreur lors du chiffrement:', error);
    return null;
  }
};

// Déchiffrer des données
const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) return null;

    // Séparer IV, données chiffrées et auth tag
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Format de données chiffrées invalide');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const authTag = Buffer.from(parts[2], 'hex');
    
    // Créer le decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    decipher.setAAD(Buffer.from('kheops-set-digital', 'utf8'));
    decipher.setAuthTag(authTag);
    
    // Déchiffrer les données
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Erreur lors du déchiffrement:', error);
    return null;
  }
};

// Hasher un mot de passe avec salt
const hashPassword = async (password) => {
  try {
    const saltRounds = 12;
    const bcrypt = require('bcryptjs');
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('Erreur lors du hashage du mot de passe:', error);
    return null;
  }
};

// Vérifier un mot de passe
const verifyPassword = async (password, hash) => {
  try {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe:', error);
    return false;
  }
};

// Générer un token sécurisé
const generateSecureToken = (length = 32) => {
  try {
    return crypto.randomBytes(length).toString('hex');
  } catch (error) {
    console.error('Erreur lors de la génération du token:', error);
    return null;
  }
};

// Chiffrer un objet JSON
const encryptObject = (obj) => {
  try {
    const jsonString = JSON.stringify(obj);
    return encryptData(jsonString);
  } catch (error) {
    console.error('Erreur lors du chiffrement de l\'objet:', error);
    return null;
  }
};

// Déchiffrer un objet JSON
const decryptObject = (encryptedData) => {
  try {
    const jsonString = decryptData(encryptedData);
    if (!jsonString) return null;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Erreur lors du déchiffrement de l\'objet:', error);
    return null;
  }
};

// Vérifier l'intégrité des données
const verifyDataIntegrity = (data, signature) => {
  try {
    const hmac = crypto.createHmac('sha256', Buffer.from(ENCRYPTION_KEY, 'hex'));
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Erreur lors de la vérification d\'intégrité:', error);
    return false;
  }
};

// Signer des données
const signData = (data) => {
  try {
    const hmac = crypto.createHmac('sha256', Buffer.from(ENCRYPTION_KEY, 'hex'));
    hmac.update(data);
    return hmac.digest('hex');
  } catch (error) {
    console.error('Erreur lors de la signature des données:', error);
    return null;
  }
};

module.exports = {
  encryptData,
  decryptData,
  hashPassword,
  verifyPassword,
  generateSecureToken,
  encryptObject,
  decryptObject,
  verifyDataIntegrity,
  signData
}; 