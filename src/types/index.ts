export interface Ebook {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice?: number; // Prix original en cas de promotion
  isOnSale?: boolean; // Indique si le produit est en promotion
  imageUrl: string;
  features: string[];
  publishedDate: string;
  pages: number;
  language: string;
  format: string[];
  // New fields
  tableOfContents?: TableOfContentsItem[];
  faq?: FAQItem[];
  author?: Author;
  category?: string;
  images?: string[]; // Additional images for gallery view
  isFeatured?: boolean; // Indique si l'ebook est mis en avant
  purchaseUrl?: string; // URL d'achat de l'ebook
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Author {
  name: string;
  role: string;
  imageUrl: string;
}
