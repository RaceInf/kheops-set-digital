import React, { useEffect, useRef } from 'react';

interface FAQAccordionProps {
  content?: string;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ content }) => {
  const listenersRef = useRef<Map<HTMLDetailsElement, EventListener>>(new Map());

  useEffect(() => {
    const setupFAQAccordion = () => {
      const faqSection = document.querySelector('.faq-section');
      if (!faqSection) return;

      const faqItems = faqSection.querySelectorAll('details.faq-item');
      
      // Fonction pour fermer tous les autres éléments
      const closeOtherItems = (currentItem: HTMLDetailsElement) => {
        faqItems.forEach(item => {
          const detailsItem = item as HTMLDetailsElement;
          if (detailsItem !== currentItem && detailsItem.open) {
            detailsItem.open = false;
          }
        });
      };

      // Nettoyer les anciens écouteurs
      listenersRef.current.forEach((listener, element) => {
        element.removeEventListener('toggle', listener);
      });
      listenersRef.current.clear();

      // Ajouter les nouveaux écouteurs
      faqItems.forEach(item => {
        const detailsItem = item as HTMLDetailsElement;
        
        const handleToggle = () => {
          if (detailsItem.open) {
            closeOtherItems(detailsItem);
          }
        };

        detailsItem.addEventListener('toggle', handleToggle);
        listenersRef.current.set(detailsItem, handleToggle);
      });
    };

    // Attendre que le DOM soit complètement chargé
    const timeoutId = setTimeout(setupFAQAccordion, 300);
    
    return () => {
      clearTimeout(timeoutId);
      // Nettoyer les écouteurs au démontage
      listenersRef.current.forEach((listener, element) => {
        element.removeEventListener('toggle', listener);
      });
      listenersRef.current.clear();
    };
  }, [content]);

  return null;
};

export default FAQAccordion;
