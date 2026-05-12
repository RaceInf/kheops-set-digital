import React from 'react';
import { Author } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface EbookAuthorProps {
  author: Author;
  className?: string;
}

const EbookAuthor = ({ author, className = '' }: EbookAuthorProps) => {
  if (!author) return null;
  
  const initials = author.name
    .split(' ')
    .map(name => name[0])
    .join('');

  return (
    <motion.div 
      className={`flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl mb-6 border border-gray-200 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <Avatar className="h-16 w-16 border-2 border-kheops-gold shadow-md">
        {author.imageUrl ? (
          <AvatarImage src={author.imageUrl} alt={author.name} />
        ) : (
          <AvatarFallback className="bg-kheops-gold/10 text-kheops-gold">
            {initials || <User className="h-8 w-8" />}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex flex-col">
        <h3 className="font-bold text-lg text-gray-900 leading-tight">{author.name}</h3>
        <p className="text-gray-600 italic text-xs sm:text-sm md:text-base whitespace-nowrap -mt-3">{author.role}</p>
      </div>
    </motion.div>
  );
};

export default EbookAuthor;
