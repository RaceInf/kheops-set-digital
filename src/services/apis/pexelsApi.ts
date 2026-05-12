import { ImageResult } from '../../types/image';

export class PexelsApi {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_PEXELS_API_KEY || '';
    console.log('PexelsApi initialized with key:', this.apiKey ? 'Present' : 'Missing');
  }

  async searchImages(query: string, options?: any): Promise<ImageResult[]> {
    if (!this.apiKey) {
      console.log('Pexels: No API key provided');
      return [];
    }
    
    try {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10`;
      console.log('Pexels: Searching for:', query);
      
      const res = await fetch(url, {
        headers: {
          'Authorization': this.apiKey
        }
      });
      console.log('Pexels: Response status:', res.status);
      
      if (!res.ok) {
        console.error('Pexels: API error:', res.status, res.statusText);
        return [];
      }
      
      const data = await res.json();
      console.log('Pexels: Found', data.photos?.length || 0, 'images');
      
      return (data.photos || []).map((img: any) => ({
        url: img.src?.large,
        thumb: img.src?.medium,
        alt: img.alt || query,
        source: 'Pexels',
        author: img.photographer,
        author_url: img.photographer_url,
      }));
    } catch (error) {
      console.error('Pexels: Fetch error:', error);
      return [];
    }
  }
} 