import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Fait défiler la fenêtre vers le haut de la page instantanément
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]); // Se déclenche à chaque changement de chemin

  return null; // Ce composant ne rend rien visuellement
};

export default ScrollToTop; 