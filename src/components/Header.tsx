import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  activeLink: string;
}

const Header: React.FC<HeaderProps> = ({ activeLink }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold font-montserrat text-gray-900">KHEOPS SET DIGITAL</div>
        <nav className="hidden md:flex space-x-8">
          {['Accueil', 'Services', 'Boutique', 'À propos', 'Contact'].map((item) => (
            <Link
              key={item}
              to={item === 'Accueil' ? '/' : `/${item.toLowerCase()}`}
              className={`font-medium ${item === activeLink ? 'text-yellow-400' : 'text-gray-700'} hover:text-yellow-500 transition-colors`}
            >
              {item}
            </Link>
          ))}
        </nav>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-300">
          Demander un devis
        </button>
      </div>
    </header>
  );
};

export default Header;
