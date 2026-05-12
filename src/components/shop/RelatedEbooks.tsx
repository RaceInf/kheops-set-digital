import React from 'react';
import { Link } from 'react-router-dom';
import { Ebook } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Book } from 'lucide-react';
import { PriceDisplay } from '@/components/shop/PriceDisplay';
import { useCurrency } from '@/contexts/CurrencyContext';

interface RelatedEbooksProps {
  currentEbookId: string;
  currentCategory?: string;
  ebooks: Ebook[];
}

const RelatedEbooks = ({ currentEbookId, currentCategory, ebooks }: RelatedEbooksProps) => {
  const { formatPrice } = useCurrency();
  // Filter ebooks to show only those in the same category and not the current one
  const relatedEbooks = ebooks
    .filter(ebook => 
      ebook.id !== currentEbookId && 
      (currentCategory ? ebook.category === currentCategory : true)
    )
    .slice(0, 3);

  if (relatedEbooks.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="bg-kheops-gold/20 text-kheops-gold p-2 rounded-full mr-3">
          <Book size={20} />
        </span>
        Vous aimerez aussi
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedEbooks.map(ebook => (
          <Link to={`/boutique/${ebook.id}`} key={ebook.id}>
            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-0 group">
              <div className="aspect-[3/2] w-full relative bg-gray-100">
                {ebook.imageUrl ? (
                  <img 
                    src={ebook.imageUrl} 
                    alt={ebook.title} 
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-kheops-gold/10">
                    <Book size={40} className="text-kheops-gold/50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-kheops-salmon text-white px-2 py-1 rounded-full text-sm lg:text-base font-bold shadow-md">
                  {formatPrice(ebook.price)}
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-1 text-lg">{ebook.title}</h3>
                <p className="text-gray-500 line-clamp-2 text-sm mt-1">{ebook.subtitle}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedEbooks;
