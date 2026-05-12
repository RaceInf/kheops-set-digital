const crypto = require('crypto');

// Générer une clé secrète TOTP
const generateTOTP = () => {
  return crypto.randomBytes(20).toString('base32');
};

// Générer un code TOTP
const generateTOTPCode = (secret, timeStep = 30) => {
  try {
    const counter = Math.floor(Date.now() / 1000 / timeStep);
    const buffer = Buffer.alloc(8);
    
    for (let i = 0; i < 8; i++) {
      buffer[7 - i] = (counter & 0xff);
      counter = counter >> 8;
    }

    const key = Buffer.from(secret, 'base32');
    const hmac = crypto.createHmac('sha1', key);
    hmac.update(buffer);
    const hash = hmac.digest();

    const offset = hash[hash.length - 1] & 0xf;
    const code = ((hash[offset] & 0x7f) << 24) |
                 ((hash[offset + 1] & 0xff) << 16) |
                 ((hash[offset + 2] & 0xff) << 8) |
                 (hash[offset + 3] & 0xff);

    return (code % 1000000).toString().padStart(6, '0');
  } catch (error) {
    console.error('Erreur lors de la génération du code TOTP:', error);
    return null;
  }
};

// Vérifier un code TOTP
const verifyTOTP = (secret, code, timeStep = 30, window = 1) => {
  try {
    const currentCode = generateTOTPCode(secret, timeStep);
    
    if (currentCode === code) {
      return true;
    }

    // Vérifier les codes dans la fenêtre de temps
    for (let i = 1; i <= window; i++) {
      const pastCode = generateTOTPCode(secret, timeStep, -i);
      const futureCode = generateTOTPCode(secret, timeStep, i);
      
      if (pastCode === code || futureCode === code) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Erreur lors de la vérification du code TOTP:', error);
    return false;
  }
};

// Générer un QR code pour l'application 2FA
const generateQRCode = (username, secret, issuer = 'KHEOPS SET DIGITAL') => {
  const otpauth = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(username)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
  
  return otpauth;
};

// Vérifier la validité d'une clé secrète TOTP
const isValidTOTPSecret = (secret) => {
  try {
    if (!secret || typeof secret !== 'string') {
      return false;
    }

    // Vérifier que c'est une chaîne base32 valide
    const base32Regex = /^[A-Z2-7]+=*$/;
    if (!base32Regex.test(secret)) {
      return false;
    }

    // Tester la génération d'un code
    const testCode = generateTOTPCode(secret);
    return testCode !== null;

  } catch (error) {
    return false;
  }
};

// Générer des codes de récupération
const generateRecoveryCodes = (count = 10) => {
  const codes = [];
  
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(code);
  }
  
  return codes;
};

// Vérifier un code de récupération
const verifyRecoveryCode = (storedCodes, providedCode) => {
  if (!storedCodes || !Array.isArray(storedCodes)) {
    return false;
  }

  const normalizedCode = providedCode.toUpperCase().replace(/[^A-F0-9]/g, '');
  
  const index = storedCodes.indexOf(normalizedCode);
  if (index !== -1) {
    // Supprimer le code utilisé
    storedCodes.splice(index, 1);
    return true;
  }

  return false;
};

module.exports = {
  generateTOTP,
  generateTOTPCode,
  verifyTOTP,
  generateQRCode,
  isValidTOTPSecret,
  generateRecoveryCodes,
  verifyRecoveryCode
}; 