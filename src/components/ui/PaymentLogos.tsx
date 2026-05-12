import React from 'react';
// import { motion } from 'framer-motion'; // Supprimé car non utilisé

// Liste des méthodes de paiement
const paymentMethods = [
  {
    name: 'Visa',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
    size: 'h-4',
  },
  {
    name: 'Mastercard',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    size: 'h-5',
  },
  {
    name: 'Orange Money',
    logoUrl: 'https://i.ibb.co/84bWT23v/Orange-Money-emblem.png',
    size: 'h-6',
  },
  {
    name: 'MTN Mobile Money',
    logoUrl: 'https://i.ibb.co/Ff28gm9/unnamed-1.png',
    size: 'h-8',
  },
];

const PaymentLogos = () => {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 mt-2">
      {paymentMethods.map((method) => (
        <img
          key={method.name}
          src={method.logoUrl}
          alt={method.name}
          className={`${method.size} object-contain filter grayscale hover:grayscale-0 transition duration-300`}
          // whileHover={{ scale: 1.1 }} // Supprimé
          // whileTap={{ scale: 0.95 }} // Supprimé
        />
      ))}
    </div>
  );
};

export default PaymentLogos; 