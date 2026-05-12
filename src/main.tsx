import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/globals.css';
import './styles/articleModern.css';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Préchargement des polices
const preloadFonts = () => {
  const fontLinks = [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap' }
  ];

  fontLinks.forEach(font => {
    const link = document.createElement('link');
    Object.entries(font).forEach(([key, value]) => {
      if (value !== undefined) {
        link.setAttribute(key, value);
      }
    });
    document.head.appendChild(link);
  });
};

preloadFonts();

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
