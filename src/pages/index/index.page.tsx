// Import React and other necessary dependencies
import React from 'react';

// Import your Index component
import Index from '../Index';

// Define the page component
export { Page };

function Page() {
  return (
    <>
      <Index />
    </>
  );
}

// Export the document props if needed
export const documentProps = {
  title: 'Accueil - KHEOPS SET DIGITAL',
  description: 'Agence de communication digitale spécialisée dans la création de sites web, stratégie digitale, et formation.'
};
