import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Save, 
  Download, 
  Edit, 
  Eye, 
  Trash2, 
  Archive, 
  RotateCcw, 
  Calendar,
  Target,
  BarChart3,
  Sparkles,
  Plus, 
  Search, 
  FileText,
  X,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types
type ArticleStatus = 'draft' | 'published' | 'archived' | 'trash';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  languageTone: string;
}

interface FormData {
  title: string;
  content: string;
  category: string;
  wordCount: number;
  languageTone: string;
}

// Données statiques
const categories = [
  'Marketing Digital',
  'Développement Web',
  'SEO',
  'Réseaux Sociaux',
  'E-commerce',
  'Stratégie Digitale',
  'Formation',
  'Actualités'
];

const languageTones = [
  { value: 'professional', label: 'Professionnel', description: 'Ton formel et expert' },
  { value: 'friendly', label: 'Amical', description: 'Ton décontracté et accessible' },
  { value: 'conversational', label: 'Conversationnel', description: 'Ton naturel et engageant' },
  { value: 'authoritative', label: 'Autoritaire', description: 'Ton expert et confiant' },
  { value: 'educational', label: 'Éducatif', description: 'Ton pédagogique et clair' }
];

const wordCountOptions = [
  { value: 500, label: '500 mots (Court)' },
  { value: 1000, label: '1000 mots (Moyen)' },
  { value: 1500, label: '1500 mots (Long)' },
  { value: 2000, label: '2000 mots (Très long)' },
  { value: 2500, label: '2500 mots (Complet)' },
  { value: 3000, label: '3000 mots (Exhaustif)' }
];

export default function ArticleGeneratorTest() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'creation' | 'drafts' | 'scheduled' | 'published' | 'archived' | 'trash'>('creation');
  const [showEditor, setShowEditor] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    category: categories[0],
    wordCount: 1000,
    languageTone: 'professional'
  });

  // Charger les articles depuis localStorage
  useEffect(() => {
    const savedArticles = localStorage.getItem('articles');
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    }
  }, []);

  // Sauvegarder les articles dans localStorage
  useEffect(() => {
    localStorage.setItem('articles', JSON.stringify(articles));
  }, [articles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleWordCountChange = (value: string) => {
    setFormData(prev => ({ ...prev, wordCount: parseInt(value) }));
  };

  const handleLanguageToneChange = (value: string) => {
    setFormData(prev => ({ ...prev, languageTone: value }));
  };

  const getWordCount = (text: string) => {
    return text.split(/\s+/).filter(Boolean).length;
  };

  const handleSaveDraft = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre et le contenu sont requis",
        variant: "destructive"
      });
      return;
    }

    const newArticle: Article = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        category: formData.category,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      wordCount: getWordCount(formData.content),
      languageTone: formData.languageTone
    };

    setArticles(prev => [newArticle, ...prev]);
      
      // Réinitialiser le formulaire
      setFormData({
        title: '',
        content: '',
        category: categories[0],
      wordCount: 1000,
      languageTone: 'professional'
    });

    toast({
      title: "Succès",
      description: "Article sauvegardé en brouillon",
    });
  };

  const updateArticleStatus = (articleId: string, newStatus: ArticleStatus) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, status: newStatus, updatedAt: new Date().toISOString() }
        : article
    ));

    const statusMessages = {
      draft: "Article remis en brouillon",
      published: "Article publié",
      archived: "Article archivé",
      trash: "Article mis en corbeille"
    };

    toast({
      title: "Succès",
      description: statusMessages[newStatus],
    });
  };

  const deleteArticle = (articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, status: 'trash', updatedAt: new Date().toISOString() }
        : article
    ));
    toast({
      title: "Succès",
      description: "Article mis en corbeille",
    });
  };

  const permanentlyDeleteArticle = (articleId: string) => {
    setArticles(prev => prev.filter(article => article.id !== articleId));
    toast({
      title: "Succès",
      description: "Article supprimé définitivement",
    });
  };

  const restoreFromTrash = (articleId: string, targetStatus: 'draft' | 'published') => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, status: targetStatus, updatedAt: new Date().toISOString() }
        : article
    ));
    toast({
      title: "Succès",
      description: "Article restauré",
    });
  };

  const emptyTrash = () => {
    setArticles(prev => prev.filter(article => article.status !== 'trash'));
    toast({
      title: "Succès",
      description: "Corbeille vidée",
    });
  };

  const getArticlesByStatus = (status: ArticleStatus) => {
    return articles.filter(article => article.status === status);
  };

  const exportArticle = () => {
    if (!formData.content.trim()) {
      toast({
        title: "Erreur",
        description: "Aucun contenu à exporter",
        variant: "destructive"
      });
      return;
    }
    
    const blob = new Blob([formData.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.title || 'article'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Succès",
      description: "Article exporté",
    });
  };

  const generateSuggestions = () => {
    toast({
      title: "Fonctionnalité",
      description: "Suggestions de contenu - À implémenter",
    });
  };

  const analyzeSEO = () => {
    toast({
      title: "Fonctionnalité",
      description: "Analyse SEO - À implémenter",
    });
  };

  const analyzeAdvancedSEO = () => {
    toast({
      title: "Fonctionnalité",
      description: "SEO Avancé - À implémenter",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gestionnaire d'Articles
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Créez, gérez et publiez vos articles
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('creation')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'creation'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Plus className="inline mr-2 h-4 w-4" />
              Création
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'drafts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Edit className="inline mr-2 h-4 w-4" />
              Brouillons ({getArticlesByStatus('draft').length})
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'published'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <FileText className="inline mr-2 h-4 w-4" />
              Publiés ({getArticlesByStatus('published').length})
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'archived'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Archive className="inline mr-2 h-4 w-4" />
              Archivés ({getArticlesByStatus('archived').length})
            </button>
            <button
              onClick={() => setActiveTab('trash')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'trash'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Trash2 className="inline mr-2 h-4 w-4" />
              Corbeille ({getArticlesByStatus('trash').length})
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'creation' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panneau de configuration */}
            <div className="lg:col-span-1">
        <Card>
          <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Configuration
                  </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
                  {/* Titre */}
                  <div>
                    <Label className="text-sm font-medium">
                      Titre de l'article *
                    </Label>
              <Input
                value={formData.title}
                onChange={handleInputChange}
                      placeholder="Entrez le titre de votre article..."
                      className="mt-1"
                      name="title"
              />
            </div>

                  {/* Catégorie */}
                  <div>
                    <Label className="text-sm font-medium">
                      Catégorie
                    </Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

                  {/* Ton du langage */}
                  <div>
                    <Label className="text-sm font-medium">
                      Ton du langage
                    </Label>
                    <Select value={formData.languageTone} onValueChange={handleLanguageToneChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageTones.map((tone) => (
                          <SelectItem key={tone.value} value={tone.value}>
                            <div>
                              <div className="font-medium">{tone.label}</div>
                              <div className="text-xs text-gray-500">{tone.description}</div>
            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
            </div>

                  {/* Objectif de mots */}
                  <div>
                    <Label className="text-sm font-medium">
                      Objectif de mots (optionnel)
                    </Label>
                    <Select value={formData.wordCount.toString()} onValueChange={handleWordCountChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {wordCountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Outils d'aide à la rédaction */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium mb-3">
                      Outils d'aide
                    </h3>
                    
                    <div className="space-y-2">
            <Button 
              variant="outline" 
                        size="sm"
                        onClick={generateSuggestions}
                        className="w-full justify-start"
                      >
                  <Sparkles className="mr-2 h-4 w-4" />
                        Suggestions de contenu
            </Button>
                      
              <Button 
                variant="outline"
                        size="sm"
                        onClick={analyzeSEO}
                        className="w-full justify-start"
                      >
                        <Target className="mr-2 h-4 w-4" />
                        Analyse SEO
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={analyzeAdvancedSEO}
                        className="w-full justify-start"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        SEO Avancé
                      </Button>
                    </div>
                  </div>

                  {/* Actions principales */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      <Button
                onClick={handleSaveDraft}
                        disabled={!formData.title.trim() || !formData.content.trim()}
                        className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                        Sauvegarder en brouillon
              </Button>
                      
              <Button 
                        variant="outline"
                        onClick={exportArticle}
                        disabled={!formData.content.trim()}
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Exporter l'article
              </Button>
            </div>
                  </div>
                </CardContent>
        </Card>
            </div>

            {/* Zone d'édition principale */}
            <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                    <CardTitle>Éditeur d'article</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{getWordCount(formData.content)} mots</span>
                      <span>•</span>
                      <span>{formData.content.length} caractères</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
                  {/* Boutons Éditeur/Aperçu */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={showEditor ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowEditor(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Éditeur
                              </Button>
                              <Button 
                      variant={!showEditor ? "default" : "outline"}
                                size="sm"
                      onClick={() => setShowEditor(false)}
                              >
                      <Eye className="mr-2 h-4 w-4" />
                      Aperçu
                              </Button>
                            </div>

                  {showEditor ? (
                    <Textarea
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Rédigez votre article ici... Vous pouvez utiliser du HTML pour la mise en forme."
                      className="min-h-[500px] resize-none"
                      name="content"
                    />
                  ) : (
                    <div className="min-h-[500px] border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800 overflow-y-auto">
                      {formData.content ? (
                        <div 
                          className="prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: formData.content }}
                        />
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          Aucun contenu à prévisualiser. Rédigez votre article dans l'éditeur.
                        </p>
                      )}
                          </div>
                  )}
                        </CardContent>
                      </Card>
                </div>
        </div>
        )}

        {/* Onglets de gestion des articles */}
        {activeTab !== 'creation' && (
          <div className="space-y-4">
            {activeTab === 'trash' && getArticlesByStatus('trash').length > 0 && (
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Corbeille</h2>
                <Button variant="destructive" size="sm" onClick={emptyTrash}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Vider la corbeille
                </Button>
              </div>
            )}

            <div className="grid gap-4">
              {getArticlesByStatus(activeTab).map((article) => (
                <Card key={article.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-4 text-sm">
                                                          <span>Catégorie: {article.category}</span>
                            <span>{article.wordCount} mots</span>
                                                          <span>Date: {formatDate(article.updatedAt)}</span>
                    </div>
                        </CardDescription>
                  </div>
                  <div className="flex gap-2">
                        {activeTab === 'drafts' && (
                          <>
                    <Button
                      variant="outline"
                      size="sm"
                              onClick={() => updateArticleStatus(article.id, 'published')}
                    >
                              Publier
                    </Button>
                    <Button
                              variant="outline"
                      size="sm"
                              onClick={() => updateArticleStatus(article.id, 'archived')}
                    >
                              <Archive className="h-4 w-4" />
                    </Button>
        </>
      )}
                        {activeTab === 'published' && (
                          <>
                        <Button
                              variant="outline"
                          size="sm"
                              onClick={() => updateArticleStatus(article.id, 'draft')}
                        >
                              Remettre en brouillon
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                              onClick={() => updateArticleStatus(article.id, 'archived')}
                        >
                              <Archive className="h-4 w-4" />
                        </Button>
                          </>
                        )}
                        {activeTab === 'archived' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateArticleStatus(article.id, 'draft')}
                            >
                              Restaurer
                            </Button>
                          </>
                        )}
                        {activeTab === 'trash' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => restoreFromTrash(article.id, 'draft')}
                            >
                              <RotateCcw className="h-4 w-4" />
                              </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => permanentlyDeleteArticle(article.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              </Button>
                          </>
                        )}
                        {activeTab !== 'trash' && (
                              <Button 
                            variant="outline"
                                size="sm"
                            onClick={() => deleteArticle(article.id)}
                              >
                            <Trash2 className="h-4 w-4" />
                              </Button>
                        )}
                            </div>
                          </div>
                  </CardHeader>
                      </Card>
                    ))}
                </div>

            {getArticlesByStatus(activeTab).length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <div className="text-4xl mb-4">
                      {activeTab === 'drafts' && 'Brouillons'}
                                              {activeTab === 'published' && 'Publiés'}
                                              {activeTab === 'archived' && 'Archivés'}
                                              {activeTab === 'trash' && 'Corbeille'}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {activeTab === 'drafts' && 'Aucun brouillon'}
                      {activeTab === 'published' && 'Aucun article publié'}
                      {activeTab === 'archived' && 'Aucun article archivé'}
                      {activeTab === 'trash' && 'Corbeille vide'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {activeTab === 'drafts' && 'Commencez par créer un nouvel article'}
                      {activeTab === 'published' && 'Publiez vos premiers articles'}
                      {activeTab === 'archived' && 'Les articles archivés apparaîtront ici'}
                      {activeTab === 'trash' && 'Les articles supprimés apparaîtront ici'}
                    </p>
                  </div>
            </CardContent>
          </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 