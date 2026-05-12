// Service principal pour la recherche d'images via plusieurs APIs
import { UnsplashApi } from './apis/unsplashApi';
import { PexelsApi } from './apis/pexelsApi';
import { PixabayApi } from './apis/pixabayApi';
import { ImageResult } from '../types/image';

export class ImageService {
  apis;

  constructor() {
    this.apis = [
      new UnsplashApi(),
      new PexelsApi(),
      new PixabayApi(),
    ];
  }

  // Recherche d'images avec fallback
  async searchImages(query: string, options?: any): Promise<ImageResult[]> {
    for (const api of this.apis) {
      try {
        const results = await api.searchImages(query, options);
        if (results && results.length > 0) {
          return results;
        }
      } catch (e) {
        // Continue vers l'API suivante
        continue;
      }
    }
    return [];
  }
} 