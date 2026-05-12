import React, { useState } from 'react';
import { ImageService } from '../../services/imageService';
import { ImageResult } from '../../types/image';

const imageService = new ImageService();

export default function ImageSearchTest() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const images = await imageService.searchImages(query);
      setResults(images);
      if (images.length === 0) setError('Aucune image trouvée.');
    } catch (err) {
      setError('Erreur lors de la recherche.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 12 }}>
      <h2>Test Recherche d'Images Multi-APIs</h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Mot-clé (ex: marketing, innovation...)"
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={loading || !query} style={{ padding: '8px 16px', borderRadius: 4 }}>
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
        {results.map((img, idx) => (
          <div key={idx} style={{ border: '1px solid #eee', borderRadius: 8, padding: 6, textAlign: 'center' }}>
            <img src={img.thumb || img.url} alt={img.alt} style={{ width: '100%', borderRadius: 6, marginBottom: 4 }} />
            <div style={{ fontSize: 12, color: '#555' }}>{img.alt}</div>
            <div style={{ fontSize: 11, color: '#888' }}>{img.source}</div>
            {img.author && (
              <div style={{ fontSize: 11 }}>
                {img.author_url ? (
                  <a href={img.author_url} target="_blank" rel="noopener noreferrer">{img.author}</a>
                ) : (
                  img.author
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 