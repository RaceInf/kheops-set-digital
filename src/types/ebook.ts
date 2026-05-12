export interface Ebook {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  format?: string[];
  pages?: number;
  features?: string[];
  isOnSale?: boolean;
  rating: number;
  reviews: number;
} 