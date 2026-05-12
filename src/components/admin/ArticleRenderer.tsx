import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Eye, 
  Share2, 
  BookOpen,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Info,
  Quote,
  Code,
  List,
  ExternalLink,
  Image as ImageIcon,
  ZoomIn,
  Download,
  X
} from 'lucide-react';

interface ArticleRendererProps {
  article: {
    title: string;
    content: string;
    category: string;
    author?: string;
    publishedAt?: string;
    wordCount?: number;
    tags?: string[];
    keywords?: string[];
    excerpt?: string;
    images?: Array<{
      url: string;
      thumb?: string;
      alt: string;
      source: string;
      author?: string;
      author_url?: string;
    }>;
  };
  showHeader?: boolean;
  showMetadata?: boolean;
  showActions?: boolean;
  className?: string;
  variant?: 'preview' | 'full' | 'compact';
}

export default function ArticleRenderer({
  article,
  showHeader = true,
  showMetadata = true,
  showActions = true,
  className = '',
  variant = 'full'
}: ArticleRendererProps) {
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageGallery, setShowImageGallery] = useState(false);

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour calculer le temps de lecture
  const getReadingTime = (wordCount: number) => {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min de lecture`;
  };

  // Fonction pour parser le contenu HTML et l'améliorer
  const parseContent = (content: string) => {
    // Remplacer les balises HTML par des classes Tailwind CSS
    return content
      .replace(/<h1>/g, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">')
      .replace(/<h2>/g, '<h2 class="text-2xl font-semibold text-gray-800 mb-4 mt-8 first:mt-0">')
      .replace(/<h3>/g, '<h3 class="text-xl font-semibold text-gray-800 mb-3 mt-6">')
      .replace(/<h4>/g, '<h4 class="text-lg font-medium text-gray-800 mb-2 mt-4">')
      .replace(/<p>/g, '<p class="text-gray-700 leading-relaxed mb-4">')
      .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-2 mb-4 text-gray-700">')
      .replace(/<ol>/g, '<ol class="list-decimal list-inside space-y-2 mb-4 text-gray-700">')
      .replace(/<li>/g, '<li class="ml-4">')
      .replace(/<strong>/g, '<strong class="font-semibold text-gray-900">')
      .replace(/<em>/g, '<em class="italic text-gray-800">')
      .replace(/<code>/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">')
      .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 italic text-gray-700 mb-4">')
      .replace(/<a\s+href=/g, '<a class="text-blue-600 hover:text-blue-800 underline" href=')
      .replace(/<img/g, '<img class="rounded-lg shadow-md max-w-full h-auto cursor-pointer hover:shadow-lg transition-shadow duration-300" ')
      .replace(/<table>/g, '<table class="w-full border-collapse border border-gray-300 mb-4">')
      .replace(/<th>/g, '<th class="bg-gray-100 border border-gray-300 px-4 py-2 text-left font-semibold">')
      .replace(/<td>/g, '<td class="border border-gray-300 px-4 py-2">');
  };

  // Fonction pour extraire les images du contenu
  const extractImagesFromContent = (content: string) => {
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    const images: string[] = [];
    let match;
    
    while ((match = imgRegex.exec(content)) !== null) {
      images.push(match[1]);
    }
    
    return images;
  };

  // Fonction pour créer un sommaire
  const createTableOfContents = (content: string) => {
    const headings = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g);
    if (!headings) return [];
    
    return headings.map((heading, index) => {
      const text = heading.replace(/<[^>]*>/g, '');
      const level = heading.match(/<h([1-6])/)?.[1] || '2';
      return { text, level: parseInt(level), id: `section-${index}` };
    });
  };

  const tableOfContents = createTableOfContents(article.content);
  const contentImages = extractImagesFromContent(article.content);
  const allImages = [...(article.images || []), ...contentImages.map(url => ({ url, alt: 'Image de l\'article' }))];

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* En-tête de l'article */}
      {showHeader && (
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="text-center pb-6">
            <div className="space-y-4">
              <Badge 
                variant="outline" 
                className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium"
              >
                <Target className="h-3 w-3" />
                {article.category}
              </Badge>
              
              <CardTitle className="text-4xl font-bold text-gray-900 leading-tight">
                {article.title}
              </CardTitle>
              
              {article.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  {article.excerpt}
                </p>
              )}
            </div>
          </CardHeader>
          
          {showMetadata && (
            <CardContent className="pt-0">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                {article.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                )}
                
                {article.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                )}
                
                {article.wordCount && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{getReadingTime(article.wordCount)}</span>
                  </div>
                )}
                
                {article.wordCount && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{article.wordCount.toLocaleString()} mots</span>
                  </div>
                )}

                {allImages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>{allImages.length} image{allImages.length > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <Tag className="h-4 w-4 text-gray-400" />
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Galerie d'images (si des images sont disponibles) */}
      {variant === 'full' && allImages.length > 0 && (
        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Galerie d'Images ({allImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages.slice(0, 8).map((image, index) => (
                <div 
                  key={index}
                  className="relative group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `Image ${index + 1}`}
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
            {allImages.length > 8 && (
              <div className="text-center mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowImageGallery(true)}
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Voir toutes les images ({allImages.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sommaire (pour les articles longs) */}
      {variant === 'full' && tableOfContents.length > 3 && (
        <Card className="mb-8 border-l-4 border-blue-500 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <List className="h-5 w-5" />
              Sommaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              {tableOfContents.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.id}`}
                  className={`block text-sm hover:text-blue-600 transition-colors ${
                    item.level === 1 ? 'font-semibold text-gray-900' :
                    item.level === 2 ? 'font-medium text-gray-800 ml-4' :
                    'text-gray-600 ml-8'
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </CardContent>
        </Card>
      )}

      {/* Contenu principal */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8">
          <article className="prose prose-lg max-w-none">
            {/* Rendu du contenu avec style moderne */}
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ 
                __html: parseContent(article.content) 
              }}
            />
            
            {/* Améliorations visuelles pour les éléments spéciaux */}
            <div className="mt-8 space-y-6">
              {/* Section des points clés */}
              {(article.content.includes('points clés') || article.content.includes('Points clés')) && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Points Clés à Retenir
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {article.content.match(/•\s*(.+)/g)?.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{point.replace('• ', '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Section des conseils pratiques */}
              {article.content.includes('conseil') && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    Conseils Pratiques
                  </h3>
                  <div className="text-gray-700 space-y-3">
                    {article.content.match(/💡\s*(.+)/g)?.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{tip.replace('💡 ', '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section des avertissements */}
              {(article.content.includes('attention') || article.content.includes('Attention')) && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border-l-4 border-orange-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Points d'Attention
                  </h3>
                  <div className="text-gray-700">
                    {article.content.match(/⚠️\s*(.+)/g)?.map((warning, index) => (
                      <div key={index} className="flex items-start gap-3 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>{warning.replace('⚠️ ', '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </CardContent>
      </Card>

      {/* Actions et partage */}
      {showActions && (
        <Card className="mt-8 border-0 shadow-sm bg-gradient-to-r from-gray-50 to-white">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Aperçu
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Voir en ligne
                </Button>
                {allImages.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => setShowImageGallery(true)}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Galerie
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp className="h-4 w-4" />
                <span>Article optimisé pour le SEO</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal pour l'image sélectionnée */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Image agrandie"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal pour la galerie complète */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl max-h-full overflow-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Galerie d'Images</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImageGallery(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages.map((image, index) => (
                <div 
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `Image ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 