import { GeneratedArticle } from '../types/article';

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[éèê]/g, 'e')
    .replace(/[àâ]/g, 'a')
    .replace(/[ùû]/g, 'u')
    .replace(/[ôö]/g, 'o')
    .replace(/[îï]/g, 'i')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function generateExcerpt(content: string, maxLength: number = 160): string {
  const textContent = content.replace(/<[^>]*>/g, '');
  if (textContent.length <= maxLength) return textContent;
  
  const truncated = textContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

export function optimizeSEO(title: string, excerpt: string) {
  const seoTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  const seoDescription = excerpt.length > 160 ? excerpt.substring(0, 157) + '...' : excerpt;
  
  return { seoTitle, seoDescription };
}

// Analyse SEO avancée
export function analyzeSEO(content: string, title: string, keywords: string[]): {
  score: number;
  recommendations: string[];
  issues: string[];
  strengths: string[];
} {
  const analysis = {
    score: 0,
    recommendations: [] as string[],
    issues: [] as string[],
    strengths: [] as string[]
  };

  // Analyse du titre
  if (title.length < 30) {
    analysis.issues.push('Titre trop court (minimum 30 caractères recommandé)');
  } else if (title.length > 60) {
    analysis.issues.push('Titre trop long (maximum 60 caractères recommandé)');
  } else {
    analysis.strengths.push('Titre de longueur optimale');
    analysis.score += 10;
  }

  // Analyse du contenu
  const wordCount = content.split(' ').length;
  if (wordCount < 300) {
    analysis.issues.push('Contenu trop court (minimum 300 mots recommandé)');
  } else if (wordCount > 2000) {
    analysis.issues.push('Contenu très long (peut affecter l\'engagement)');
  } else {
    analysis.strengths.push(`Contenu de bonne longueur (${wordCount} mots)`);
    analysis.score += 15;
  }

  // Analyse des mots-clés
  const contentLower = content.toLowerCase();
  const titleLower = title.toLowerCase();
  
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const contentOccurrences = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
    const titleOccurrence = titleLower.includes(keywordLower);
    
    if (contentOccurrences === 0) {
      analysis.issues.push(`Mot-clé "${keyword}" absent du contenu`);
    } else if (contentOccurrences < 2) {
      analysis.recommendations.push(`Augmenter l'utilisation du mot-clé "${keyword}"`);
    } else {
      analysis.strengths.push(`Mot-clé "${keyword}" bien utilisé (${contentOccurrences} occurrences)`);
      analysis.score += 5;
    }
    
    if (titleOccurrence) {
      analysis.strengths.push(`Mot-clé "${keyword}" présent dans le titre`);
      analysis.score += 5;
    } else {
      analysis.recommendations.push(`Inclure le mot-clé "${keyword}" dans le titre`);
    }
  });

  // Analyse de la structure
  const h2Count = (content.match(/<h2>/g) || []).length;
  const h3Count = (content.match(/<h3>/g) || []).length;
  const hasImages = content.includes('<img');
  const hasLinks = content.includes('<a href');
  const hasLists = content.includes('<ul>') || content.includes('<ol>');

  if (h2Count < 2) {
    analysis.issues.push('Peu de sous-titres H2 (structure à améliorer)');
  } else {
    analysis.strengths.push(`Bonne structure avec ${h2Count} sous-titres H2`);
    analysis.score += 10;
  }

  if (h3Count < 1) {
    analysis.recommendations.push('Ajouter des sous-sections H3 pour une meilleure hiérarchie');
  } else {
    analysis.strengths.push(`Hiérarchie bien structurée avec ${h3Count} sous-sections H3`);
    analysis.score += 5;
  }

  if (!hasImages) {
    analysis.recommendations.push('Ajouter des images pour améliorer l\'engagement');
  } else {
    analysis.strengths.push('Images présentes dans le contenu');
    analysis.score += 5;
  }

  if (!hasLinks) {
    analysis.recommendations.push('Ajouter des liens internes et externes pour le SEO');
  } else {
    analysis.strengths.push('Liens présents dans le contenu');
    analysis.score += 5;
  }

  if (!hasLists) {
    analysis.recommendations.push('Ajouter des listes pour améliorer la lisibilité');
  } else {
    analysis.strengths.push('Listes présentes dans le contenu');
    analysis.score += 5;
  }

  // Analyse de la densité de mots-clés
  const totalWords = content.split(' ').length;
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const occurrences = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
    const density = (occurrences / totalWords) * 100;
    
    if (density > 3) {
      analysis.issues.push(`Densité trop élevée pour "${keyword}" (${density.toFixed(1)}%)`);
    } else if (density < 0.5) {
      analysis.recommendations.push(`Augmenter la densité du mot-clé "${keyword}" (actuellement ${density.toFixed(1)}%)`);
    } else {
      analysis.strengths.push(`Densité optimale pour "${keyword}" (${density.toFixed(1)}%)`);
      analysis.score += 5;
    }
  });

  // Score final
  analysis.score = Math.min(100, analysis.score);

  return analysis;
}

// Optimisation automatique du contenu
export function autoOptimizeContent(content: string, title: string, keywords: string[]): string {
  let optimizedContent = content;
  
  // Ajouter des liens automatiquement si manquants
  if (!content.includes('<a href')) {
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      optimizedContent = optimizedContent.replace(regex, (match) => {
        return `<a href="/services/${match.toLowerCase().replace(/\s+/g, '-')}" target="_blank">${match}</a>`;
      });
    });
  }
  
  // Améliorer la structure si nécessaire
  const h2Count = (content.match(/<h2>/g) || []).length;
  if (h2Count < 2) {
    const sections = ['Introduction', 'Développement', 'Conclusion'];
    sections.forEach(section => {
      if (!content.includes(`<h2>${section}`)) {
        const insertPoint = content.indexOf('</p>') + 4;
        optimizedContent = optimizedContent.slice(0, insertPoint) + 
          `\n<h2>${section}</h2>\n<p>Contenu de la section ${section.toLowerCase()}...</p>` + 
          optimizedContent.slice(insertPoint);
      }
    });
  }
  
  return optimizedContent;
} 