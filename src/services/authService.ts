import React from 'react';
import { backendService, type LoginRequest } from './backendService';

// Configuration de sécurité
const SECURITY_CONFIG = {
  SESSION_DURATION: 2 * 60 * 60 * 1000, // 2 heures
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SALT_ROUNDS: 10,
};

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    permissions: string[];
    twoFactorEnabled: boolean;
  } | null;
  sessionInfo: {
    isActive: boolean;
    expiresIn: number;
  };
}

class AuthService {
  private state: AuthState = {
    isAuthenticated: false,
    user: null,
    sessionInfo: { isActive: false, expiresIn: 0 }
  };

  private listeners: ((state: AuthState) => void)[] = [];

  constructor() {
    this.initializeAuth();
  }

  // Initialiser l'authentification au démarrage
  private async initializeAuth() {
    if (backendService.isAuthenticated()) {
      const result = await backendService.verifyAuth();
      if (result.success && result.data) {
        this.state.user = result.data.user;
        this.state.isAuthenticated = true;
        this.updateSessionInfo();
        this.notifyListeners();
      } else {
        // Token invalide, déconnecter
        await this.logout();
      }
    }
  }

  // Mettre à jour les informations de session
  private updateSessionInfo() {
    // Calculer le temps restant (approximatif)
    const token = backendService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiresAt = payload.exp * 1000;
        const now = Date.now();
        const expiresIn = Math.max(0, Math.floor((expiresAt - now) / 60000)); // en minutes
        
        this.state.sessionInfo = {
          isActive: expiresIn > 0,
          expiresIn
        };
      } catch (error) {
        this.state.sessionInfo = { isActive: false, expiresIn: 0 };
      }
    } else {
      this.state.sessionInfo = { isActive: false, expiresIn: 0 };
    }
  }

  // Notifier les listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Connexion
  async login(credentials: LoginRequest): Promise<{ success: boolean; message: string }> {
    try {
      const result = await backendService.login(credentials);
      
      if (result.success && result.data) {
        this.state.user = result.data.user;
        this.state.isAuthenticated = true;
        this.updateSessionInfo();
        this.notifyListeners();
        
        return {
          success: true,
          message: 'Connexion réussie'
        };
      } else {
        return {
          success: false,
          message: result.error || 'Échec de la connexion'
        };
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return {
        success: false,
        message: 'Erreur de connexion au serveur'
      };
    }
  }

  // Déconnexion
  async logout(): Promise<void> {
    await backendService.logout();
    this.state = {
      isAuthenticated: false,
      user: null,
      sessionInfo: { isActive: false, expiresIn: 0 }
    };
    this.notifyListeners();
  }

  // Rafraîchir la session
  refreshSession(): boolean {
    if (this.state.isAuthenticated) {
      this.updateSessionInfo();
      this.notifyListeners();
      return this.state.sessionInfo.isActive;
    }
    return false;
  }

  // Vérifier l'authentification
  isAuthenticated(): boolean {
    return this.state.isAuthenticated && this.state.sessionInfo.isActive;
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    return this.state.user;
  }

  // Obtenir les informations de session
  getSessionInfo() {
    return this.state.sessionInfo;
  }

  // Vérifier les permissions
  hasPermission(permission: string): boolean {
    if (!this.state.user) return false;
    return this.state.user.permissions.includes(permission) || this.state.user.role === 'admin';
  }

  // Vérifier le rôle
  hasRole(role: string): boolean {
    if (!this.state.user) return false;
    return this.state.user.role === role || this.state.user.role === 'admin';
  }

  // Écouter les changements d'état
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    
    // Retourner une fonction pour se désabonner
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Obtenir l'état actuel
  getState(): AuthState {
    return { ...this.state };
  }
}

// Instance singleton
export const authService = new AuthService();

// Hook React pour l'authentification (optionnel)
export const useAuth = () => {
  const [state, setState] = React.useState<AuthState>(authService.getState());

  React.useEffect(() => {
    const unsubscribe = authService.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...state,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    refreshSession: authService.refreshSession.bind(authService),
    hasPermission: authService.hasPermission.bind(authService),
    hasRole: authService.hasRole.bind(authService)
  };
}; 