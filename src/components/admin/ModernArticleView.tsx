import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Tag, Eye, Clock } from 'lucide-react';

interface ModernArticleViewProps {
  article: {
    title: string;
    content: string;
    author?: string;
    category?: string;
    publishedAt?: string;
    wordCount?: number;
    keywords?: string[];
  };
  showHeader?: boolean;
  className?: string;
}

const ModernArticleView: React.FC<ModernArticleViewProps> = ({ 
  article, 
  showHeader = true,
  className = ''
}) => {
  // Calculer le temps de lecture estimé
  const readingTime = article.wordCount ? Math.ceil(article.wordCount / 200) : 5;

  return (
    <div className={`article-modern ${className}`}>
      {showHeader && (
        <header>
          <h1>{article.title}</h1>
          <div className="meta">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{article.author || 'KHEOPS SET DIGITAL'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span>{article.category || 'Marketing Digital'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min de lecture</span>
              </div>
            </div>
          </div>
        </header>
      )}

      <div 
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Footer avec tags */}
      {article.keywords && article.keywords.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {article.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernArticleView; 