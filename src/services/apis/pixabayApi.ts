import { ImageResult } from '../../types/image';

export class PixabayApi {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_PIXABAY_API_KEY || '';
    console.log('PixabayApi initialized with key:', this.apiKey ? 'Present' : 'Missing');
  }

  async searchImages(query: string, options?: any): Promise<ImageResult[]> {
    if (!this.apiKey) {
      console.log('Pixabay: No API key provided');
      return [];
    }
    
    try {
      const url = `https://pixabay.com/api/?key=${this.apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=10`;
      console.log('Pixabay: Searching for:', query);
      
      const res = await fetch(url);
      console.log('Pixabay: Response status:', res.status);
      
      if (!res.ok) {
        console.error('Pixabay: API error:', res.status, res.statusText);
        return [];
      }
      
      const data = await res.json();
      console.log('Pixabay: Found', data.hits?.length || 0, 'images');
      
      return (data.hits || []).map((img: any) => ({
        url: img.webformatURL,
        thumb: img.previewURL,
        alt: img.tags || query,
        source: 'Pixabay',
        author: img.user,
        author_url: `https://pixabay.com/users/${img.user}-${img.user_id}/`,
      }));
    } catch (error) {
      console.error('Pixabay: Fetch error:', error);
      return [];
    }
  }
} 