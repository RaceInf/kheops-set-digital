import React, { useState, useEffect } from 'react';
import { ContentGenerator } from '../../services/contentGenerator';
import { articleManager, SavedArticle } from '../../services/articleManager';
import { useToast } from '../ui/use-toast';

// UI components du design-system
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import {
  Loader2,
  Sparkles,
  Trash2,
  Globe,
  Save,
  Edit,
  Eye,
  Download,
  Plus,
  Search,
  X,
  FileText,
  FileCheck,
  Archive,
  Image as ImageIcon,
  Code,
  RotateCcw,
  Upload,
  Lightbulb,
  Settings,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';

// Catégories d'articles
const categories = [
  'Stratégie de contenu',
  'Marketing digital',
  'Rédaction web',
  'SEO',
  'Réseaux sociaux',
  'Email marketing',
  'Autre'
] as const;

// Options de nombre de mots
const wordCountOptions = [
  { value: 300, label: '300 mots (Court)' },
  { value: 500, label: '500 mots (Moyen)' },
  { value: 800, label: '800 mots (Long)' },
  { value: 1200, label: '1200 mots (Très long)' },
  { value: 1500, label: '1500 mots (Complet)' },
  { value: 2000, label: '2000 mots (Expert)' },
  { value: 2500, label: '2500 mots (Ultra long)' },
  { value: 3000, label: '3000 mots (Maximal)' }
] as const;

type ArticleFormData = {
  title: string;
  content: string;
  category: string;
  wordCount: number;
  selectedImages?: Array<{
    url: string;
    alt: string;
    source: string;
    author?: string;
    author_url?: string;
  }>;
};

// Fonction utilitaire pour formater la date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export default function ArticleGeneratorTestSimple({ onStatsUpdate }: { onStatsUpdate?: () => void }) {
  const { toast } = useToast();
  const contentGenerator = new ContentGenerator();
  
  // États
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    category: categories[0],
    wordCount: 500,
    selectedImages: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'drafts' | 'published' | 'archived' | 'trash'>('generate');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<SavedArticle[]>([]);

  // Effets
  useEffect(() => {
    setArticles(articleManager.getAllArticles());
  }, []);

  // Fonctions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryChange = (value: string) => setFormData(prev => ({ ...prev, category: value }));
  const handleWordCountChange = (value: string) => setFormData(prev => ({ ...prev, wordCount: parseInt(value) }));

  const refreshArticles = () => {
    setArticles(articleManager.getAllArticles());
  };

  const handleGenerateArticle = async () => {
    if (!formData.title || !formData.category) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le titre et la catégorie",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const generated = await contentGenerator.generateArticle(formData.title, formData.category);

      if (generated && generated.content) {
        setFormData(prev => ({
          ...prev,
          content: generated.content
        }));
        
        toast({
          title: "Succès",
          description: "Article généré avec succès !",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de la génération",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération de l'article",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Erreur",
        description: "Titre et contenu requis",
        variant: "destructive",
      });
      return;
    }

    try {
      articleManager.saveAsDraft({
        title: formData.title,
        excerpt: formData.content.substring(0, 200),
        content: formData.content,
        author: 'Admin',
        category: formData.category,
        images: formData.selectedImages || [],
        tags: [formData.category],
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        seoTitle: formData.title,
        seoDescription: formData.content.substring(0, 160),
        publishedAt: new Date().toISOString(),
        wordCount: formData.content.split(/\s+/).length,
        keywords: [formData.category]
      });

      refreshArticles();
      toast({
        title: "Succès",
        description: "Brouillon sauvegardé !",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    }
  };

  const getWordCount = (htmlContent: string) => {
    const cleanText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return cleanText.split(/\s+/).filter(word => word.length > 0).length;
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const drafts = filteredArticles.filter(article => article.status === 'draft');
  const published = filteredArticles.filter(article => article.status === 'published');
  const archived = filteredArticles.filter(article => article.status === 'archived');
  const trash = filteredArticles.filter(article => article.status === 'trash');

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Générateur d'Articles</h1>
          <p className="text-sm sm:text-base text-gray-600">Créez et gérez vos articles de blog</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertTitle>Succès</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          <TabsTrigger value="generate" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Générer</TabsTrigger>
          <TabsTrigger value="drafts" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Brouillons ({drafts.length})</TabsTrigger>
          <TabsTrigger value="published" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Publiés ({published.length})</TabsTrigger>
          <TabsTrigger value="archived" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Archives ({archived.length})</TabsTrigger>
          <TabsTrigger value="trash" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Corbeille ({trash.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Génération d'Article
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'article</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Stratégies de marketing digital en 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wordCount">Nombre de mots à générer</Label>
                <Select value={formData.wordCount.toString()} onValueChange={handleWordCountChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {wordCountOptions.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={15}
                  className="font-mono text-sm"
                  placeholder="Contenu HTML de l'article..."
                />
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{display: "inline-block", marginRight: "4px", verticalAlign: "middle"}}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {getWordCount(formData.content)} mots
                  </span>
                <span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{display: "inline-block", marginRight: "4px", verticalAlign: "middle"}}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {Math.ceil(getWordCount(formData.content) / 200)} min
        </span>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  onClick={handleGenerateArticle} 
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {loading ? 'Génération...' : 'Générer l\'article'}
                </Button>
                <Button onClick={handleSaveDraft} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Sauvegarder comme brouillon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher dans les brouillons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-3">
            {drafts.map(article => (
              <Card key={article.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{article.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
                        <span>{article.category}</span>
                        <span>•</span>
                        <span>{formatDate(article.lastModified)}</span>
                        <span>•</span>
                        <span>{article.wordCount} mots</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex items-center gap-1 text-xs"
                    >
                      <Edit className="h-3 w-3" />
                      Modifier
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      className="flex items-center justify-center w-8 h-8 p-0"
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {drafts.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun brouillon trouvé</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <div className="text-center py-8">
            <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Section des articles publiés</p>
          </div>
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <div className="text-center py-8">
            <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Section des archives</p>
          </div>
        </TabsContent>

        <TabsContent value="trash" className="space-y-4">
          <div className="text-center py-8">
            <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Section de la corbeille</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 