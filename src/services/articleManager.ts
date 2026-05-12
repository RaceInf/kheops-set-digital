import { BlogPost } from '../data/blogPosts';
import { GeneratedArticle } from '../types/article';

export interface SavedArticle extends BlogPost {
  status: 'draft' | 'published' | 'archived' | 'trash';
  savedAt: string;
  publishedAt?: string;
  lastModified: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  wordCount: number;
  keywords: string[];
}

class ArticleManager {
  private readonly STORAGE_KEY = 'kheopscope_articles';
  private readonly DRAFTS_KEY = 'kheopscope_drafts';

  // Récupérer tous les articles sauvegardés
  getAllArticles(): SavedArticle[] {
    try {
      const articles = localStorage.getItem(this.STORAGE_KEY);
      return articles ? JSON.parse(articles) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return [];
    }
  }

  // Récupérer les articles publiés uniquement
  getPublishedArticles(): SavedArticle[] {
    return this.getAllArticles().filter(article => article.status === 'published');
  }

  // Récupérer les brouillons
  getDrafts(): SavedArticle[] {
    return this.getAllArticles().filter(article => article.status === 'draft');
  }

  // Sauvegarder un article comme brouillon
  saveAsDraft(generatedArticle: GeneratedArticle): SavedArticle {
    const draft: SavedArticle = {
      id: this.generateId(),
      title: generatedArticle.title,
      excerpt: generatedArticle.excerpt,
      content: generatedArticle.content,
      author: generatedArticle.author,
      date: new Date().toISOString().split('T')[0],
      category: generatedArticle.category,
      image: generatedArticle.images.length > 0 ? generatedArticle.images[0].url : '/placeholder.svg',
      tags: generatedArticle.tags,
      status: 'draft',
      savedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      slug: generatedArticle.slug,
      seoTitle: generatedArticle.seoTitle,
      seoDescription: generatedArticle.seoDescription,
      publishedAt: generatedArticle.publishedAt,
      wordCount: generatedArticle.wordCount || generatedArticle.content.split(' ').length,
      keywords: generatedArticle.keywords || generatedArticle.tags,
    };

    const articles = this.getAllArticles();
    articles.unshift(draft);
    this.saveArticles(articles);

    return draft;
  }

  // Publier un article
  publishArticle(articleId: string): boolean {
    const articles = this.getAllArticles();
    const articleIndex = articles.findIndex(article => article.id === articleId);
    
    if (articleIndex === -1) return false;

    articles[articleIndex].status = 'published';
    articles[articleIndex].publishedAt = new Date().toISOString();
    articles[articleIndex].lastModified = new Date().toISOString();

    this.saveArticles(articles);
    return true;
  }

  // Mettre à jour un article
  updateArticle(articleId: string, updates: Partial<SavedArticle>): boolean {
    const articles = this.getAllArticles();
    const articleIndex = articles.findIndex(article => article.id === articleId);
    
    if (articleIndex === -1) return false;

    articles[articleIndex] = {
      ...articles[articleIndex],
      ...updates,
      lastModified: new Date().toISOString(),
    };

    this.saveArticles(articles);
    return true;
  }

  // Supprimer un article
  deleteArticle(articleId: string): boolean {
    const articles = this.getAllArticles();
    const filteredArticles = articles.filter(article => article.id !== articleId);
    
    if (filteredArticles.length === articles.length) return false;

    this.saveArticles(filteredArticles);
    return true;
  }

  // Archiver un article
  archiveArticle(articleId: string): boolean {
    return this.updateArticle(articleId, { status: 'archived' });
  }

  // Déplacer vers la corbeille
  moveToTrash(articleId: string): boolean {
    return this.updateArticle(articleId, { status: 'trash' });
  }

  // Restaurer depuis la corbeille
  restoreFromTrash(articleId: string): boolean {
    return this.updateArticle(articleId, { status: 'draft' });
  }

  // Récupérer les articles archivés
  getArchivedArticles(): SavedArticle[] {
    return this.getAllArticles().filter(article => article.status === 'archived');
  }

  // Récupérer les articles dans la corbeille
  getTrashedArticles(): SavedArticle[] {
    return this.getAllArticles().filter(article => article.status === 'trash');
  }

  // Récupérer un article par ID
  getArticleById(articleId: string): SavedArticle | null {
    const articles = this.getAllArticles();
    return articles.find(article => article.id === articleId) || null;
  }

  // Sauvegarder les articles dans le localStorage
  private saveArticles(articles: SavedArticle[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des articles:', error);
    }
  }

  // Générer un ID unique
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Exporter les articles (pour sauvegarde)
  exportArticles(): string {
    const articles = this.getAllArticles();
    return JSON.stringify(articles, null, 2);
  }

  // Importer des articles (pour restauration)
  importArticles(jsonData: string): boolean {
    try {
      const articles = JSON.parse(jsonData);
      if (Array.isArray(articles)) {
        this.saveArticles(articles);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'import des articles:', error);
      return false;
    }
  }

  // Statistiques
  getStats() {
    const articles = this.getAllArticles();
    return {
      total: articles.length,
      published: articles.filter(a => a.status === 'published').length,
      drafts: articles.filter(a => a.status === 'draft').length,
      archived: articles.filter(a => a.status === 'archived').length,
      trash: articles.filter(a => a.status === 'trash').length,
    };
  }
}

export const articleManager = new ArticleManager(); 