// Service pour communiquer avec le backend sécurisé
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

interface LoginRequest {
  username: string;
  password: string;
  totpCode?: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    permissions: string[];
    twoFactorEnabled: boolean;
    lastLogin: string;
  };
  expiresIn: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_id?: number;
}

interface CreateArticleRequest {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status?: 'draft' | 'published' | 'archived';
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

interface UpdateArticleRequest extends Partial<CreateArticleRequest> {}

class BackendService {
  private token: string | null = null;
  private refreshTimeout: NodeJS.Timeout | null = null;

  constructor() {
    // Récupérer le token depuis localStorage au démarrage
    this.token = localStorage.getItem('auth_token');
    this.setupTokenRefresh();
  }

  // Configuration des en-têtes de requête
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Gestion des erreurs de requête
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Gérer les erreurs d'authentification
      if (response.status === 401) {
        this.handleAuthError();
      }
      
      return {
        success: false,
        error: errorData.error || 'Erreur de requête',
        code: errorData.code
      };
    }

    return await response.json();
  }

  // Gestion des erreurs d'authentification
  private handleAuthError() {
    this.logout();
    window.location.href = '/admin';
  }

  // Configuration du refresh automatique du token
  private setupTokenRefresh() {
    if (this.token) {
      // Vérifier le token toutes les 5 minutes
      this.refreshTimeout = setInterval(() => {
        this.refreshToken();
      }, 5 * 60 * 1000);
    }
  }

  // Rafraîchir le token
  private async refreshToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.token);
      } else {
        this.handleAuthError();
      }
    } catch (error) {
      console.error('Erreur lors du refresh du token:', error);
      this.handleAuthError();
    }
  }

  // Définir le token
  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
    this.setupTokenRefresh();
  }

  // Authentification
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const result = await this.handleResponse<LoginResponse>(response);
      
      if (result.success && result.data) {
        this.setToken(result.data.token);
      }

      return result;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur'
      };
    }
  }

  // Vérifier l'authentification
  async verifyAuth(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: this.getHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur de vérification:', error);
      return {
        success: false,
        error: 'Erreur de vérification'
      };
    }
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: this.getHeaders(),
        });
      }
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('auth_token');
      if (this.refreshTimeout) {
        clearInterval(this.refreshTimeout);
        this.refreshTimeout = null;
      }
    }
  }

  // Articles - Récupérer la liste
  async getArticles(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sort?: string;
    order?: 'ASC' | 'DESC';
  } = {}): Promise<ApiResponse<{
    data: Article[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/articles?${searchParams}`, {
        headers: this.getHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des articles'
      };
    }
  }

  // Articles - Récupérer par ID
  async getArticle(id: number): Promise<ApiResponse<Article>> {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        headers: this.getHeaders(),
      });

      return await this.handleResponse<Article>(response);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération de l\'article'
      };
    }
  }

  // Articles - Créer
  async createArticle(article: CreateArticleRequest): Promise<ApiResponse<Article>> {
    try {
      const response = await fetch(`${API_BASE_URL}/articles`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(article),
      });

      return await this.handleResponse<Article>(response);
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      return {
        success: false,
        error: 'Erreur lors de la création de l\'article'
      };
    }
  }

  // Articles - Mettre à jour
  async updateArticle(id: number, article: UpdateArticleRequest): Promise<ApiResponse<Article>> {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(article),
      });

      return await this.handleResponse<Article>(response);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de l\'article'
      };
    }
  }

  // Articles - Supprimer
  async deleteArticle(id: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      return {
        success: false,
        error: 'Erreur lors de la suppression de l\'article'
      };
    }
  }

  // Articles - Publier
  async publishArticle(id: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}/publish`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la publication de l\'article:', error);
      return {
        success: false,
        error: 'Erreur lors de la publication de l\'article'
      };
    }
  }

  // Admin - Tableau de bord
  async getDashboard(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: this.getHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération du tableau de bord:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération du tableau de bord'
      };
    }
  }

  // Admin - Logs d'audit
  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    event?: string;
    severity?: string;
    username?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ApiResponse> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/admin/audit-logs?${searchParams}`, {
        headers: this.getHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des logs d\'audit:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des logs d\'audit'
      };
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Obtenir le token actuel
  getToken(): string | null {
    return this.token;
  }
}

// Instance singleton
export const backendService = new BackendService();

// Types exportés
export type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  Article,
  CreateArticleRequest,
  UpdateArticleRequest
}; 