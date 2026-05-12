export interface ArticleImage {
  url: string;
  thumb?: string;
  alt: string;
  source: string;
  author?: string;
  author_url?: string;
}

export interface GeneratedArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  keywords: string[];
  images: ArticleImage[];
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
  wordCount: number;
} 