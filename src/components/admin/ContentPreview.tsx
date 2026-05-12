import React from 'react';
import { GeneratedArticle } from '../../types/article';
import ArticleSeo from '../seo/ArticleSeo';

interface Props {
  article: GeneratedArticle;
}

export default function ContentPreview({ article }: Props) {
  // Pour la prévisualisation locale, on met une URL fictive
  const url = typeof window !== 'undefined' ? window.location.href : 'https://kheops-set-digital.com/blog/' + article.slug;
  return (
    <div style={{ background: '#fafafa', borderRadius: 12, padding: 24 }}>
      <ArticleSeo article={article} url={url} />
      <h2>{article.title}</h2>
      <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>Catégorie : {article.category} | Auteur : {article.author} | {new Date(article.publishedAt).toLocaleDateString()}</div>
      <div style={{ color: '#555', fontSize: 15, marginBottom: 12 }}><strong>Résumé :</strong> {article.excerpt}</div>
      <div style={{ marginBottom: 16 }}>
        <strong>Images associées :</strong>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
          {article.images.length === 0 && <span style={{ color: '#888' }}>Aucune image trouvée.</span>}
          {article.images.map((img, idx) => (
            <div key={idx} style={{ border: '1px solid #eee', borderRadius: 8, padding: 4, textAlign: 'center', width: 120 }}>
              <img src={img.url} alt={img.alt} loading="lazy" style={{ width: '100%', borderRadius: 6, marginBottom: 2 }} />
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
      <div style={{ marginBottom: 16 }}>
        <strong>Contenu de l'article :</strong>
        <div style={{ background: '#fff', padding: 12, borderRadius: 8, marginTop: 8 }} dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>SEO Title :</strong> {article.seoTitle}<br />
        <strong>SEO Description :</strong> {article.seoDescription}
      </div>
      <div style={{ color: '#888', fontSize: 12 }}>
        <strong>Slug :</strong> {article.slug}<br />
        <strong>Tags :</strong> {article.tags.join(', ')}
      </div>
    </div>
  );
} 