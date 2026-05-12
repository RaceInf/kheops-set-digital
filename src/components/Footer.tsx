import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Contenu du footer existant */}
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-4 text-center">
          <p className="text-xs font-open-sans text-gray-600">
            2025 KHEOPS SET DIGITAL – Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
