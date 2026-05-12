import { Link } from 'react-router-dom';
import { ArrowRight, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ebooks } from '@/data/ebooks';
import HomeEbookCard from './HomeEbookCard';

const BoutiqueSection = () => {
  // Filtrer les ebooks en promo ou prendre les 3 premiers
  const featuredEbooks = ebooks.filter(ebook => ebook.isOnSale).slice(0, 3) || ebooks.slice(0, 3);

  if (featuredEbooks.length === 0) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-white to-kheops-lightGray" id="boutique">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold">
            Nos <span className="text-kheops-gold">E-books</span> en Vedette
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des guides pratiques pour booster vos compétences digitales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredEbooks.map((ebook) => (
            <HomeEbookCard
              key={ebook.id}
              image={ebook.images && ebook.images.length > 0 ? ebook.images[0] : '/placeholder.svg'}
              title={ebook.title}
              description={ebook.description}
              price={ebook.price}
              originalPrice={ebook.originalPrice}
              isOnSale={ebook.isOnSale}
              link={ebook.id ? `/boutique/${ebook.id}` : '#'}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoutiqueSection; 