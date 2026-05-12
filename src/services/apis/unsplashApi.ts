import { ImageResult } from '../../types/image';

export class UnsplashApi {
  private accessKey: string;

  constructor() {
    this.accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '';
    console.log('UnsplashApi initialized with key:', this.accessKey ? 'Present' : 'Missing');
  }

  async searchImages(query: string, options?: any): Promise<ImageResult[]> {
    if (!this.accessKey) {
      console.log('Unsplash: No access key provided');
      return [];
    }
    
    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&client_id=${this.accessKey}`;
      console.log('Unsplash: Searching for:', query);
      
      const res = await fetch(url);
      console.log('Unsplash: Response status:', res.status);
      
      if (!res.ok) {
        console.error('Unsplash: API error:', res.status, res.statusText);
        return [];
      }
      
      const data = await res.json();
      console.log('Unsplash: Found', data.results?.length || 0, 'images');
      
      return (data.results || []).map((img: any) => ({
        url: img.urls?.regular,
        thumb: img.urls?.thumb,
        alt: img.alt_description || img.description || query,
        source: 'Unsplash',
        author: img.user?.name,
        author_url: img.user?.links?.html,
      }));
    } catch (error) {
      console.error('Unsplash: Fetch error:', error);
      return [];
    }
  }
} 