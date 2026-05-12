import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatPrice } from '@/lib/currencyUtils';

export type Ebook = {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverImage: string;
  available: boolean;
  pages: number;
  slug: string;
  category: string;
  isNew?: boolean;
  isOnSale?: boolean;
};

type EbookStoreContextType = {
  ebooks: Ebook[];
  isLoading: boolean;
  error: Error | null;
  getEbookById: (id: string) => Ebook | undefined;
  getEbookBySlug: (slug: string) => Ebook | undefined;
  formatEbookPrice: (price: number, showDecimal?: boolean) => string;
  getPriceInfo: (id: string) => { price: number; promoPrice?: number };
  isOnSale: (id: string) => boolean;
};

const EbookStoreContext = createContext<EbookStoreContextType>({
  ebooks: [],
  isLoading: false,
  error: null,
  getEbookById: () => undefined,
  getEbookBySlug: () => undefined,
  formatEbookPrice: () => '',
  getPriceInfo: () => ({ price: 0 }),
  isOnSale: () => false,
});

export const useEbookStore = () => {
  const context = useContext(EbookStoreContext);
  if (!context) {
    throw new Error('useEbookStore must be used within an EbookStoreProvider');
  }
  return context;
};

export const EbookStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: Charger les ebooks depuis l'API
    const mockEbooks: Ebook[] = [
      {
        id: '1',
        title: 'Guide de la Photographie',
        author: 'Auteur inconnu',
        description: 'Apprenez les bases de la photographie',
        price: 12900,
        coverImage: '/images/ebooks/photo-guide.jpg',
        available: true,
        pages: 200,
        slug: 'guide-photographie',
        category: 'Photographie',
      },
      {
        id: '2',
        title: 'Maîtrisez la Retouche Photo',
        author: 'Auteur inconnu',
        description: 'Techniques avancées de retouche',
        price: 19022,
        coverImage: '/images/ebooks/retouche.jpg',
        available: true,
        pages: 250,
        slug: 'maitrisez-retouche-photo',
        category: 'Retouche',
      }
    ];
    setEbooks(mockEbooks);
  }, []);

  const getEbookById = (id: string) => {
    return ebooks.find(ebook => ebook.id === id);
  };

  const getEbookBySlug = (slug: string) => {
    return ebooks.find(ebook => ebook.slug === slug);
  };

  const formatEbookPrice = (price: number, showDecimal: boolean = false) => {
    return formatPrice(price, undefined, showDecimal);
  };

  const getPriceInfo = (id: string) => {
    const ebook = getEbookById(id);
    if (!ebook) return { price: 0 };
    return {
      price: ebook.price,
      promoPrice: ebook.isOnSale ? ebook.price * 0.7 : undefined
    };
  };

  const isOnSale = (id: string) => {
    const ebook = getEbookById(id);
    return ebook?.isOnSale || false;
  };

  const value = {
    ebooks,
    isLoading,
    error,
    getEbookById,
    getEbookBySlug,
    formatEbookPrice,
    getPriceInfo,
    isOnSale
  };

  return (
    <EbookStoreContext.Provider value={value}>
      {children}
    </EbookStoreContext.Provider>
  );
}; 