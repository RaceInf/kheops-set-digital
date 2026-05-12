import React from 'react';
import { Ebook } from '@/data/ebooks';

export default function EbookCard({ ebook }: { ebook: Ebook }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-100 relative flex items-center justify-center">
        <img 
          src={ebook.imageUrl} 
          alt={ebook.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {ebook.isOnSale && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
            Promotion
          </span>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{ebook.title}</h3>
        <p className="text-sm text-gray-600 mb-3">Par {ebook.author.name}</p>
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{ebook.description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            {ebook.originalPrice && (
              <span className="text-sm text-gray-500 line-through mr-2">
                {ebook.originalPrice.toLocaleString()} FCFA
              </span>
            )}
            <span className="font-bold text-lg">{ebook.price.toLocaleString()} FCFA</span>
          </div>
          <button 
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            aria-label={`Acheter ${ebook.title}`}
          >
            Voir détails
          </button>
        </div>
      </div>
    </div>
  );
}
