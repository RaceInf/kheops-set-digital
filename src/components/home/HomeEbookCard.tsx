import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HomeEbookCardProps {
  image: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  isOnSale?: boolean;
  link: string;
}

const HomeEbookCard = ({
  image,
  title,
  description,
  price,
  originalPrice,
  isOnSale,
  link
}: HomeEbookCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="h-full overflow-hidden group hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          {isOnSale && (
            <div className="absolute top-4 right-4 bg-kheops-salmon text-white px-3 py-1 rounded-full text-sm font-medium">
              Promo
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-kheops-gold">
                {price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
              {isOnSale && originalPrice && (
                <span className="text-gray-400 line-through">
                  {originalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
              )}
            </div>
          </div>
          
          <Link to={link}>
            <Button className="w-full bg-kheops-gold hover:bg-kheops-salmon text-white group-hover:translate-x-1 transition-all duration-300">
              <span>Voir le détail</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HomeEbookCard; 