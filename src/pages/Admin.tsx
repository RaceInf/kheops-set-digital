import Navbar from '@/components/layout/Navbar';
import ArticleCreator from '@/components/admin/ArticleCreator';
import ImageSearchTest from '@/components/admin/ImageSearchTest';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, LayoutDashboard, Image, FileText, LogOut, Settings, User, ChevronRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { articleManager } from '../services/articleManager';

// Récupération des variables d'environnement côté client
const getEnv = (key: string, defaultValue: string = ''): string => {
  if (typeof window === 'undefined') return defaultValue;
  return (window as any).__NEXT_DATA__?.env?.[key] || defaultValue;
};

// Le mot de passe par défaut est 'admin123' si NEXT_PUBLIC_ADMIN_PASSWORD n'est pas défini
const ADMIN_PASSWORD = getEnv('NEXT_PUBLIC_ADMIN_PASSWORD', 'admin123');

export default function Admin() {
  const [activeTab, setActiveTab] = useState('articles');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    archived: 0,
    trash: 0
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      setError('');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  // Mettre à jour les statistiques
  const updateStats = () => {
    setStats(articleManager.getStats());
  };

  // Effet pour mettre à jour les statistiques au chargement et quand les onglets changent
  useEffect(() => {
    updateStats();
  }, [activeTab]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Espace Administrateur</h2>
                  <p className="text-blue-100">Accès sécurisé au panneau de gestion</p>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe d'administration
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        'w-full px-4 py-3 text-base rounded-lg transition-all',
                        'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        'placeholder-gray-400',
                        error && 'border-red-500'
                      )}
                      required
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive" className="border-red-100 bg-red-50">
                      <AlertDescription className="flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-6 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Se connecter
                </Button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-center text-sm text-gray-500">
                  Contactez l'administrateur en cas de perte de mot de passe
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* En-tête */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Tableau de bord</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-xs sm:text-sm"
                onClick={handleLogout}
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
                <span className="sm:hidden">Déco</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Contenu principal */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-3 sm:p-4 lg:p-6">
            {/* Navigation par onglets */}
            <div className="mb-6 sm:mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('articles')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'articles'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <FileText className="inline mr-2 h-4 w-4" />
                    Gestion des articles
                  </button>
                  <button
                    onClick={() => setActiveTab('images')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'images'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Image className="inline mr-2 h-4 w-4" />
                    Gestion des images
                  </button>
                </nav>
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {activeTab === 'articles' ? 'Gestion des articles' : 'Gestion des images'}
              </h2>
              <p className="text-sm sm:text-base text-gray-500">
                {activeTab === 'articles' 
                  ? 'Créez et gérez le contenu de votre site web' 
                  : 'Téléchargez et gérez les images de votre bibliothèque'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-sm">
                <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Total Articles</CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</div>
                  <p className="text-xs text-gray-500 mt-1">Tous les articles confondus</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-sm">
                <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Publiés</CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.published}</div>
                  <p className="text-xs text-gray-500 mt-1">Visibles sur le site</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-0 shadow-sm">
                <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Brouillons</CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.drafts}</div>
                  <p className="text-xs text-gray-500 mt-1">En cours de rédaction</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-sm">
                <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Archivés</CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.archived}</div>
                  <p className="text-xs text-gray-500 mt-1">Articles conservés</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-sm">
                <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Corbeille</CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.trash}</div>
                  <p className="text-xs text-gray-500 mt-1">Articles supprimés</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {activeTab === 'articles' && <ArticleCreator />}
              {activeTab === 'images' && <ImageSearchTest />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
