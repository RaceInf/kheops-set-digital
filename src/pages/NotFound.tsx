import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Seo from '@/components/seo/Seo';

const NotFound = () => {
  return (
    <>
      <Seo 
        title="Page non trouvée | KHEOPS SET DIGITAL"
        description="La page que vous recherchez n'existe pas."
        type="website"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
          <Link to="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
