import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Image as ImageIcon, 
  Download, 
  ExternalLink, 
  Plus,
  X,
  Check,
  RotateCcw
} from 'lucide-react';
import { ImageService } from '../../services/imageService';

interface ImageSelectorProps {
  onImagesSelected: (images: Array<{
    url: string;
    alt: string;
    source: string;
    author?: string;
    author_url?: string;
  }>) => void;
  selectedImages?: Array<{
    url: string;
    alt: string;
    source: string;
    author?: string;
    author_url?: string;
  }>;
  topic?: string;
  maxImages?: number;
}

export default function ImageSelector({
  onImagesSelected,
  selectedImages = [],
  topic = '',
  maxImages = 10
}: ImageSelectorProps) {
  const [searchQuery, setSearchQuery] = useState(topic);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImageUrls, setSelectedImageUrls] = useState<Set<string>>(
    new Set(selectedImages.map(img => img.url))
  );

  const imageService = new ImageService();

  // Rechercher des images
  const searchImages = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const results = await imageService.searchImages(query, { per_page: 20 });
      setSearchResults(results);
    } catch (error) {
      console.error('Erreur lors de la recherche d\'images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rechercher automatiquement si un topic est fourni
  useEffect(() => {
    if (topic && !searchResults.length) {
      searchImages(topic);
    }
  }, [topic]);

  // Gérer la sélection/désélection d'images
  const toggleImageSelection = (image: any) => {
    const newSelected = new Set(selectedImageUrls);
    
    if (newSelected.has(image.url)) {
      newSelected.delete(image.url);
    } else if (newSelected.size < maxImages) {
      newSelected.add(image.url);
    }
    
    setSelectedImageUrls(newSelected);
    
    // Convertir en format attendu et notifier le parent
    const selectedImagesList = Array.from(newSelected).map(url => {
      const imageData = searchResults.find(img => img.url === url) || 
                       selectedImages.find(img => img.url === url);
      return {
        url,
        alt: imageData?.alt || 'Image sélectionnée',
        source: imageData?.source || 'unknown',
        author: imageData?.author,
        author_url: imageData?.author_url
      };
    });
    
    onImagesSelected(selectedImagesList);
  };

  // Supprimer une image sélectionnée
  const removeSelectedImage = (imageUrl: string) => {
    const newSelected = new Set(selectedImageUrls);
    newSelected.delete(imageUrl);
    setSelectedImageUrls(newSelected);
    
    const selectedImagesList = Array.from(newSelected).map(url => {
      const imageData = searchResults.find(img => img.url === url) || 
                       selectedImages.find(img => img.url === url);
      return {
        url,
        alt: imageData?.alt || 'Image sélectionnée',
        source: imageData?.source || 'unknown',
        author: imageData?.author,
        author_url: imageData?.author_url
      };
    });
    
    onImagesSelected(selectedImagesList);
  };

  // Ajouter une image par URL
  const addImageByUrl = () => {
    const url = prompt('Entrez l\'URL de l\'image:');
    if (url && !selectedImageUrls.has(url) && selectedImageUrls.size < maxImages) {
      const newSelected = new Set(selectedImageUrls);
      newSelected.add(url);
      setSelectedImageUrls(newSelected);
      
      const selectedImagesList = Array.from(newSelected).map(imgUrl => {
        const imageData = searchResults.find(img => img.url === imgUrl) || 
                         selectedImages.find(img => img.url === imgUrl);
        return {
          url: imgUrl,
          alt: imageData?.alt || 'Image ajoutée manuellement',
          source: imageData?.source || 'manual',
          author: imageData?.author,
          author_url: imageData?.author_url
        };
      });
      
      onImagesSelected(selectedImagesList);
    }
  };

  return (
    <div className="space-y-6">
      {/* Recherche d'images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Recherche d'Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher des images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchImages(searchQuery)}
            />
            <Button 
              onClick={() => searchImages(searchQuery)}
              disabled={loading || !searchQuery.trim()}
              className="flex items-center gap-2"
            >
              {loading ? (
                <RotateCcw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {loading ? 'Recherche...' : 'Rechercher'}
            </Button>
            <Button 
              variant="outline"
              onClick={addImageByUrl}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter URL
            </Button>
          </div>

          {/* Résultats de recherche */}
          {searchResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Résultats ({searchResults.length})</h4>
                <Badge variant="outline">
                  {selectedImageUrls.size}/{maxImages} sélectionnées
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((image, index) => (
                  <div 
                    key={index}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageUrls.has(image.url) 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleImageSelection(image)}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `Image ${index + 1}`}
                      className="w-full h-32 object-cover"
                      loading="lazy"
                    />
                    
                    {/* Overlay de sélection */}
                    <div className={`absolute inset-0 transition-all duration-200 ${
                      selectedImageUrls.has(image.url)
                        ? 'bg-blue-500 bg-opacity-20'
                        : 'bg-black bg-opacity-0 group-hover:bg-opacity-10'
                    }`}>
                      {selectedImageUrls.has(image.url) && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    
                    {/* Informations de l'image */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs truncate">
                        {image.alt || 'Image'}
                      </p>
                      {image.author && (
                        <p className="text-white/80 text-xs">
                          Par {image.author}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Images sélectionnées */}
      {selectedImageUrls.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Images Sélectionnées ({selectedImageUrls.size})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from(selectedImageUrls).map((imageUrl, index) => {
                const imageData = searchResults.find(img => img.url === imageUrl) || 
                                 selectedImages.find(img => img.url === imageUrl);
                
                return (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={imageData?.alt || `Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    
                    {/* Boutons d'action */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-6 w-6 p-0"
                        onClick={() => removeSelectedImage(imageUrl)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Informations */}
                    <div className="mt-2">
                      <p className="text-sm font-medium truncate">
                        {imageData?.alt || 'Image'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {imageData?.source || 'unknown'}
                        </Badge>
                        {imageData?.author && (
                          <span className="text-xs text-gray-500">
                            {imageData.author}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conseils d'utilisation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <ImageIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Conseils pour les images</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Sélectionnez des images pertinentes pour illustrer votre contenu</li>
                <li>• Respectez les droits d'auteur et créditez les photographes</li>
                <li>• Utilisez des images de haute qualité pour un meilleur rendu</li>
                <li>• Les images seront automatiquement intégrées dans l'article</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 