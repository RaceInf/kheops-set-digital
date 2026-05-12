import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Check, FileText, MessageCircle, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ebook } from '@/types';
import { PriceDisplay } from './PriceDisplay';
import WhatsAppButton from './WhatsAppButton';

interface EbookCardProps {
  ebook: Ebook;
  truncateTitle?: boolean;
}

const EbookCard = ({ ebook, truncateTitle = false }: EbookCardProps) => {
  // Function to truncate title to specified length
  const formatTitle = (title: string, maxLength = 30) => {
    if (truncateTitle && title.length > maxLength) {
      return `${title.substring(0, maxLength)}...`;
    }
    return title;
  };

  const format = ebook.format && ebook.format.length > 0 ? ebook.format[0] : 'PDF';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card-hover-effect h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden border-0 bg-white/5 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-kheops-gold/10 transition-all duration-300">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {ebook.imageUrl ? (
              <img 
                src={ebook.imageUrl} 
                alt={ebook.title} 
                className="object-cover w-full h-full transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-800 to-black">
                <Book size={64} className="text-kheops-gold/50" />
              </div>
            )}
          </motion.div>
          
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="gold" className="text-black">
              {ebook.category || format}
            </Badge>
          </div>
          
          {/* Promo Badge */}
          {ebook.isOnSale && ebook.originalPrice && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md transform rotate-[-5deg]">
              PROMO
            </div>
          )}
        </div>
        
        <CardContent className="flex-grow pt-4 text-white">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-bold line-clamp-2 group-hover:text-kheops-gold transition-colors duration-300 text-white">
              {formatTitle(ebook.title)}
            </h3>
            
            {/* Small rating indicator */}
            <div className="flex items-center gap-0.5">
              <Star size={14} className="fill-kheops-gold text-kheops-gold" />
              <span className="text-xs text-gray-400">4.8</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-2">{ebook.subtitle}</p>
          
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700">
              {ebook.pages} pages
            </Badge>
            <Badge variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700">
              {ebook.language}
            </Badge>
          </div>
          
          <div className="space-y-2 mt-4 mb-2">
            {(ebook.features || []).slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="h-4 w-4 text-kheops-gold flex-shrink-0" />
                <span className="line-clamp-1">{feature}</span>
              </div>
            ))}
          </div>
          
          {/* Price moved here */}
          <div className="mt-4 mb-3">
            <PriceDisplay 
              price={ebook.price} 
              originalPrice={ebook.originalPrice} 
              isOnSale={ebook.isOnSale}
              size="sm"
              className="justify-start"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2 pt-0 pb-4">
          <Link to={`/boutique/${ebook.id}`} className="w-full">
            <Button className="w-full bg-gradient-to-r from-kheops-gold to-kheops-salmon hover:from-kheops-salmon hover:to-kheops-gold text-black font-medium transition-all duration-300 shadow-sm hover:shadow-md">
              Voir détails
            </Button>
          </Link>
          
          <div className="w-full">
            <WhatsAppButton 
              productName={ebook.title} 
              className="w-full flex items-center justify-center gap-2 bg-transparent border border-green-600 text-green-500 hover:bg-green-600 hover:text-white"
              variant="outline"
            >
              <MessageCircle className="h-4 w-4" />
              Commander sur WhatsApp
            </WhatsAppButton>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EbookCard;
