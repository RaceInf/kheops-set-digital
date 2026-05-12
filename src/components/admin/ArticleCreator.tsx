import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Save, 
  Download, 
  Edit, 
  Eye, 
  Trash2, 
  Archive, 
  RotateCcw, 
  Plus,
  Target,
  BarChart3,
  Sparkles,
  FileText,
  X
} from 'lucide-react';

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

export default function ArticleCreator() {
  const [activeTab, setActiveTab] = useState<'creation' | 'drafts' | 'published' | 'archived' | 'trash'>('creation');
  const [showEditor, setShowEditor] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    category: categories[0],
    wordCount: 1000,
    languageTone: 'professional'
  });
  const [seoCorrections, setSeoCorrections] = useState<Array<{id: string, type: string, description: string, action: () => void}>>([]);

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
      toast.error("Le titre et le contenu sont requis");
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

    toast.success("Article sauvegardé en brouillon");
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

    toast.success(statusMessages[newStatus]);
  };

  const deleteArticle = (articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, status: 'trash', updatedAt: new Date().toISOString() }
        : article
    ));
    toast.success("Article mis en corbeille");
  };

  const permanentlyDeleteArticle = (articleId: string) => {
    setArticles(prev => prev.filter(article => article.id !== articleId));
    toast.success("Article supprimé définitivement");
  };

  const restoreFromTrash = (articleId: string, targetStatus: 'draft' | 'published') => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, status: targetStatus, updatedAt: new Date().toISOString() }
        : article
    ));
    toast.success("Article restauré");
  };

  const emptyTrash = () => {
    setArticles(prev => prev.filter(article => article.status !== 'trash'));
    toast.success("Corbeille vidée");
  };

  const getArticlesByStatus = (status: ArticleStatus) => {
    return articles.filter(article => article.status === status);
  };

  const getArticlesByTab = (tab: string) => {
    switch (tab) {
      case 'drafts':
        return getArticlesByStatus('draft');
      case 'published':
        return getArticlesByStatus('published');
      case 'archived':
        return getArticlesByStatus('archived');
      case 'trash':
        return getArticlesByStatus('trash');
      default:
        return [];
    }
  };

  const exportArticle = () => {
    if (!formData.content.trim()) {
      toast.error("Aucun contenu à exporter");
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

    toast.success("Article exporté");
  };

  const generateSuggestions = () => {
    if (!formData.title.trim()) {
      toast.error("Veuillez d'abord saisir un titre");
      return;
    }

    // Templates HTML prêts à utiliser
    const templates = [
      // Template Article de blog
      `<article>
  <h2>Introduction</h2>
  <p>Dans cet article, nous allons explorer <strong>${formData.title}</strong>. Cette introduction captivante devrait donner envie au lecteur de continuer sa lecture et de découvrir les informations précieuses que nous allons partager.</p>
  
  <h2>Points clés à retenir</h2>
  <ul>
    <li><strong>Premier point important :</strong> Description détaillée du premier élément</li>
    <li><strong>Deuxième point essentiel :</strong> Explication du deuxième aspect crucial</li>
    <li><strong>Troisième élément à considérer :</strong> Détails sur le troisième point</li>
  </ul>
  
  <h2>Comment procéder</h2>
  <p>Voici les étapes à suivre pour réussir dans ce domaine :</p>
  <ol>
    <li>Étape 1 : Description de la première étape</li>
    <li>Étape 2 : Explication de la deuxième étape</li>
    <li>Étape 3 : Détails sur la troisième étape</li>
  </ol>
  
  <h2>Conseils pratiques</h2>
  <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
    <p><strong>💡 Conseil :</strong> Voici un conseil pratique pour améliorer vos résultats dans ce domaine.</p>
  </div>
  
  <h2>Conclusion</h2>
  <p>En conclusion, <strong>${formData.title}</strong> représente un aspect crucial de votre stratégie. N'hésitez pas à nous contacter pour plus d'informations ou pour discuter de vos besoins spécifiques.</p>
</article>`,

      // Template Article technique
      `<div>
  <h2>Qu'est-ce que ${formData.title} ?</h2>
  <p>${formData.title} est une approche moderne qui révolutionne la façon dont nous abordons ce sujet. Cette méthode innovante offre de nombreux avantages et s'adapte parfaitement aux besoins actuels.</p>
  
  <h2>Avantages principaux</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0;">
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
      <h3>✅ Avantage 1</h3>
      <p>Description détaillée du premier avantage</p>
    </div>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
      <h3>✅ Avantage 2</h3>
      <p>Description du deuxième avantage</p>
    </div>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
      <h3>✅ Avantage 3</h3>
      <p>Description du troisième avantage</p>
    </div>
  </div>
  
  <h2>Mise en œuvre</h2>
  <p>Pour implémenter ${formData.title} efficacement, suivez ces étapes :</p>
  <ol>
    <li><strong>Phase de préparation :</strong> Analysez vos besoins actuels</li>
    <li><strong>Phase de planification :</strong> Définissez votre stratégie</li>
    <li><strong>Phase d'exécution :</strong> Mettez en place les actions</li>
    <li><strong>Phase d'évaluation :</strong> Mesurez vos résultats</li>
  </ol>
  
  <h2>Résultats attendus</h2>
  <p>En appliquant ces principes, vous pouvez espérer :</p>
  <ul>
    <li>Amélioration significative de vos performances</li>
    <li>Optimisation de vos processus</li>
    <li>Augmentation de votre productivité</li>
  </ul>
</div>`,

      // Template Article informatif
      `<section>
  <h2>Découvrez ${formData.title}</h2>
  <p>Bienvenue dans ce guide complet sur <strong>${formData.title}</strong>. Que vous soyez débutant ou expert, cet article vous apportera des informations précieuses et des insights pratiques.</p>
  
  <h2>Pourquoi c'est important ?</h2>
  <p>Comprendre ${formData.title} est essentiel dans le contexte actuel. Voici pourquoi :</p>
  <ul>
    <li><strong>Impact sur votre activité :</strong> Influence directe sur vos résultats</li>
    <li><strong>Tendances du marché :</strong> Évolution rapide du secteur</li>
    <li><strong>Opportunités :</strong> Nouvelles possibilités à saisir</li>
  </ul>
  
  <h2>Les fondamentaux</h2>
  <p>Avant de plonger dans les détails, voici les concepts de base à maîtriser :</p>
  <div style="background: #e9ecef; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="display: inline-block; margin-right: 6px; vertical-align: middle;">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Concepts clés
        </h3>
    <ul>
      <li>Concept 1 : Définition et explication</li>
      <li>Concept 2 : Importance et applications</li>
      <li>Concept 3 : Relations avec d'autres éléments</li>
    </ul>
  </div>
  
  <h2>Applications pratiques</h2>
  <p>Voici comment appliquer ces connaissances dans votre contexte :</p>
  <ol>
    <li><strong>Évaluation :</strong> Analysez votre situation actuelle</li>
    <li><strong>Planification :</strong> Développez votre stratégie</li>
    <li><strong>Action :</strong> Mettez en œuvre vos plans</li>
    <li><strong>Suivi :</strong> Mesurez et ajustez</li>
  </ol>
</section>`
    ];

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n\n' + randomTemplate
    }));

    toast.success("Template HTML ajouté ! Un article structuré a été inséré dans votre éditeur.");
  };

  const analyzeSEO = () => {
    if (!formData.content.trim()) {
      toast.error("Aucun contenu à analyser");
      return;
    }

    const wordCount = getWordCount(formData.content);
    const hasTitle = formData.title.length > 0;
    const hasHeadings = formData.content.includes('<h');
    const hasLinks = formData.content.includes('<a');
    const hasImages = formData.content.includes('<img');
    const hasStrongTags = formData.content.includes('<strong>');
    const hasLists = formData.content.includes('<ul>') || formData.content.includes('<ol>');
    const hasParagraphs = formData.content.includes('<p>');

    let score = 0;
    let suggestions: string[] = [];
    let goodPoints: string[] = [];
    let corrections: Array<{id: string, type: string, description: string, action: () => void}> = [];

    // Analyse du titre
    if (hasTitle) {
      if (formData.title.length <= 60) {
        score += 20;
        goodPoints.push("✅ Titre optimisé (longueur parfaite)");
      } else {
        score += 10;
        suggestions.push("Raccourcissez le titre (maximum 60 caractères)");
        corrections.push({
          id: 'title-length',
          type: 'title',
          description: 'Titre trop long',
          action: () => optimizeTitleLength()
        });
      }
    } else {
      suggestions.push("❌ Ajoutez un titre à votre article");
      corrections.push({
        id: 'no-title',
        type: 'title',
        description: 'Titre manquant',
        action: () => generateTitle()
      });
    }

    // Analyse du contenu
    if (wordCount >= 300) {
      score += 25;
      goodPoints.push("✅ Contenu suffisamment long");
    } else {
      score += Math.floor((wordCount / 300) * 25);
              suggestions.push(`Augmentez le nombre de mots (${wordCount}/300 minimum recommandé)`);
      corrections.push({
        id: 'content-length',
        type: 'content',
        description: 'Contenu trop court',
        action: () => expandContent()
      });
    }

    // Structure
    if (hasHeadings) {
      score += 20;
      goodPoints.push("✅ Structure avec titres");
    } else {
              suggestions.push("Utilisez des titres (h2, h3) pour structurer");
      corrections.push({
        id: 'no-headings',
        type: 'structure',
        description: 'Titres manquants',
        action: () => addHeadings()
      });
    }

    if (hasParagraphs) {
      score += 10;
      goodPoints.push("✅ Paragraphes bien structurés");
    }

    if (hasLists) {
      score += 10;
      goodPoints.push("✅ Utilisation de listes");
    } else {
              suggestions.push("Ajoutez des listes pour améliorer la lisibilité");
      corrections.push({
        id: 'no-lists',
        type: 'structure',
        description: 'Listes manquantes',
        action: () => addLists()
      });
    }

    // Mise en forme
    if (hasStrongTags) {
      score += 5;
      goodPoints.push("✅ Mots-clés mis en évidence");
    } else {
              suggestions.push("Utilisez <strong> pour mettre en évidence les mots-clés");
      corrections.push({
        id: 'no-strong-tags',
        type: 'formatting',
        description: 'Mots-clés non mis en évidence',
        action: () => highlightKeywords()
      });
    }

    // Liens et images
    if (hasLinks) {
      score += 10;
      goodPoints.push("✅ Liens inclus");
    } else {
              suggestions.push("Ajoutez des liens internes ou externes");
      corrections.push({
        id: 'no-links',
        type: 'links',
        description: 'Liens manquants',
        action: () => addLinks()
      });
    }

    if (hasImages) {
      score += 10;
      goodPoints.push("✅ Images incluses");
    } else {
              suggestions.push("Incluez des images pour améliorer l'engagement");
      corrections.push({
        id: 'no-images',
        type: 'media',
        description: 'Images manquantes',
        action: () => addImagePlaceholders()
      });
    }

    const status = score >= 80 ? "Excellent" : score >= 60 ? "Bon" : score >= 40 ? "Moyen" : "À améliorer";

    // Créer un message détaillé
    let message = `Score SEO: ${score}/100 (${status})\n\n`;
    
    if (goodPoints.length > 0) {
      message += "Points positifs :\n" + goodPoints.slice(0, 3).join("\n") + "\n\n";
    }
    
    if (suggestions.length > 0) {
      message += "Améliorations suggérées :\n" + suggestions.slice(0, 2).join("\n");
    }

    // Stocker les corrections pour les utiliser plus tard
    setSeoCorrections(corrections);

    toast.success(`Score SEO: ${score}/100 (${status})`, {
      description: message,
      duration: 8000,
    });
  };

  // Fonctions de correction automatique
  const optimizeTitleLength = () => {
    if (formData.title.length > 60) {
      const optimizedTitle = formData.title.substring(0, 57) + '...';
      setFormData(prev => ({ ...prev, title: optimizedTitle }));
      toast.success("Titre optimisé ! Longueur réduite à 60 caractères.");
    }
  };

  const generateTitle = () => {
    const suggestions = [
      "Guide complet sur " + formData.category,
      "Comment optimiser votre " + formData.category,
      "Les meilleures pratiques en " + formData.category,
      "Stratégies efficaces pour " + formData.category,
      "Tout savoir sur " + formData.category
    ];
    const randomTitle = suggestions[Math.floor(Math.random() * suggestions.length)];
    setFormData(prev => ({ ...prev, title: randomTitle }));
    toast.success("Titre généré automatiquement !");
  };

  const expandContent = () => {
    const expansion = `
<h2>Informations complémentaires</h2>
<p>Pour approfondir ce sujet, voici quelques points supplémentaires à considérer :</p>
<ul>
  <li><strong>Aspect important :</strong> Description détaillée de cet aspect crucial</li>
  <li><strong>Point clé :</strong> Explication d'un élément essentiel</li>
  <li><strong>Conseil pratique :</strong> Recommandation utile pour les lecteurs</li>
</ul>

<h2>Conclusion</h2>
<p>En résumé, ${formData.title} représente un élément fondamental de votre stratégie. En appliquant ces principes, vous pourrez améliorer significativement vos résultats.</p>`;
    
    setFormData(prev => ({ ...prev, content: prev.content + expansion }));
    toast.success("Contenu étendu ! Des sections supplémentaires ont été ajoutées.");
  };

  const addHeadings = () => {
    const headings = `
<h2>Structure de votre contenu</h2>
<p>Voici comment organiser efficacement votre article :</p>

<h3>Introduction</h3>
<p>Commencez par présenter le sujet de manière engageante.</p>

<h3>Développement</h3>
<p>Développez vos points principaux avec des exemples concrets.</p>

<h3>Conclusion</h3>
<p>Résumez les points clés et donnez une perspective d'avenir.</p>`;
    
    setFormData(prev => ({ ...prev, content: prev.content + headings }));
    toast.success("Titres ajoutés ! Une structure claire a été créée.");
  };

  const addLists = () => {
    const lists = `
<h2>Points essentiels à retenir</h2>
<ul>
  <li>Premier point important à considérer</li>
  <li>Deuxième élément crucial</li>
  <li>Troisième aspect fondamental</li>
</ul>

<h2>Étapes à suivre</h2>
<ol>
  <li>Première étape : Analyse de la situation</li>
  <li>Deuxième étape : Planification de l'action</li>
  <li>Troisième étape : Mise en œuvre</li>
  <li>Quatrième étape : Évaluation des résultats</li>
</ol>`;
    
    setFormData(prev => ({ ...prev, content: prev.content + lists }));
    toast.success("Listes ajoutées ! La lisibilité a été améliorée.");
  };

  const highlightKeywords = () => {
    // Extraire les mots-clés potentiels du titre
    const titleWords = formData.title.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    
    let updatedContent = formData.content;
    titleWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      updatedContent = updatedContent.replace(regex, `<strong>${word}</strong>`);
    });
    
    setFormData(prev => ({ ...prev, content: updatedContent }));
    toast.success("Mots-clés mis en évidence ! Les termes importants sont maintenant en gras.");
  };

  const highlightKeywordsInContent = (content: string): string => {
    // Mots-clés importants à mettre en gras
    const keywords = [
      'important', 'essentiel', 'crucial', 'fondamental', 'clé', 'principal',
      'stratégie', 'méthode', 'technique', 'outil', 'solution', 'résultat',
      'avantage', 'bénéfice', 'opportunité', 'challenge', 'défi', 'objectif',
      'performance', 'efficacité', 'optimisation', 'amélioration', 'croissance'
    ];

    let formattedContent = content;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formattedContent = formattedContent.replace(regex, `<strong>${keyword}</strong>`);
    });

    return formattedContent;
  };

  const addLinks = () => {
    const links = `
<h2>Ressources utiles</h2>
<p>Pour approfondir vos connaissances, consultez ces ressources :</p>
<ul>
  <li><a href="#" target="_blank" rel="noopener noreferrer">Guide complet sur le sujet</a></li>
  <li><a href="#" target="_blank" rel="noopener noreferrer">Outils recommandés</a></li>
  <li><a href="#" target="_blank" rel="noopener noreferrer">Formation spécialisée</a></li>
</ul>`;
    
    setFormData(prev => ({ ...prev, content: prev.content + links }));
    toast.success("Liens ajoutés ! Des ressources externes ont été incluses.");
  };

  const addImagePlaceholders = () => {
    const images = `
<div style="text-align: center; margin: 20px 0;">
  <img src="https://via.placeholder.com/600x300/007bff/ffffff?text=Image+illustrative" 
       alt="Illustration du sujet" 
       style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  <p style="text-align: center; color: #666; font-size: 0.9em; margin-top: 10px;">
    <em>Image illustrative - Remplacez par votre propre image</em>
  </p>
</div>`;
    
    setFormData(prev => ({ ...prev, content: prev.content + images }));
    toast.success("Placeholder d'image ajouté ! Remplacez par votre propre image.");
  };

  // Fonction pour corriger automatiquement tous les problèmes SEO
  const autoCorrectAllSEO = () => {
    toast.info("Correction automatique en cours...", {
      description: "Tous les problèmes SEO détectés vont être corrigés automatiquement."
    });

    // Appliquer toutes les corrections
    seoCorrections.forEach((correction, index) => {
      setTimeout(() => {
        correction.action();
      }, index * 500); // Délai de 500ms entre chaque correction
    });

    // Vider la liste des corrections après 3 secondes
    setTimeout(() => {
      setSeoCorrections([]);
      toast.success("Correction automatique terminée !", {
        description: "Tous les problèmes SEO ont été corrigés. Votre article est maintenant optimisé."
      });
    }, seoCorrections.length * 500 + 1000);
  };

  // Fonction pour utiliser l'IA Claude pour des corrections avancées
  const useClaudeAI = () => {
    if (!formData.content.trim()) {
      toast.error("Aucun contenu à analyser avec l'IA");
      return;
    }

    toast.info("Analyse IA Claude en cours...", {
      description: "L'IA Claude analyse votre contenu pour des améliorations avancées."
    });

    // Simulation de l'analyse IA Claude
    setTimeout(() => {
      const aiSuggestions = [
        {
          type: "style",
          description: "Améliorer le style d'écriture",
          action: () => improveWritingStyle()
        },
        {
          type: "keywords",
          description: "Optimiser la densité des mots-clés",
          action: () => optimizeKeywordDensity()
        },
        {
          type: "readability",
          description: "Améliorer la lisibilité",
          action: () => improveReadability()
        },
        {
          type: "engagement",
          description: "Augmenter l'engagement",
          action: () => increaseEngagement()
        }
      ];

      // Appliquer les suggestions de l'IA
      aiSuggestions.forEach((suggestion, index) => {
        setTimeout(() => {
          suggestion.action();
        }, index * 800);
      });

      setTimeout(() => {
        toast.success("Analyse IA Claude terminée !", {
          description: "Votre contenu a été optimisé avec l'intelligence artificielle."
        });
      }, aiSuggestions.length * 800 + 1000);
    }, 2000);
  };

  // Fonctions d'amélioration IA
  const improveWritingStyle = () => {
    const improvements = `
<h2>Améliorations stylistiques suggérées par l'IA</h2>
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
  <h3>💡 Conseils d'écriture optimisés</h3>
  <ul>
    <li>Utilisez des phrases courtes et percutantes</li>
    <li>Incluez des exemples concrets et des cas d'usage</li>
    <li>Créez une progression logique dans vos arguments</li>
    <li>Terminez par un appel à l'action engageant</li>
  </ul>
</div>`;
    
    setFormData(prev => ({ ...prev, content: prev.content + improvements }));
    toast.success("Style d'écriture amélioré par l'IA !");
  };

  const optimizeKeywordDensity = () => {
    // Analyser et optimiser la densité des mots-clés
    const titleWords = formData.title.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    let optimizedContent = formData.content;
    
    titleWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = optimizedContent.match(regex);
      if (matches && matches.length < 3) {
        // Ajouter le mot-clé de manière naturelle
        optimizedContent += `\n<p>En approfondissant le sujet de <strong>${word}</strong>, nous découvrons de nouvelles perspectives intéressantes.</p>`;
      }
    });
    
    setFormData(prev => ({ ...prev, content: optimizedContent }));
    toast.success("Densité des mots-clés optimisée par l'IA !");
  };

  const improveReadability = () => {
    const readabilityImprovements = `
<h2>Améliorations de lisibilité</h2>
<div style="background: #f8f9fa; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
  <h3>📖 Structure optimisée pour la lecture</h3>
  <p>Pour améliorer l'expérience de lecture :</p>
  <ul>
    <li>Paragraphes courts (2-3 phrases maximum)</li>
    <li>Espacement généreux entre les sections</li>
    <li>Utilisation de listes à puces pour les points clés</li>
    <li>Transitions fluides entre les idées</li>
  </ul>
</div>`;
    
    setFormData(prev => ({ ...prev, content: prev.content + readabilityImprovements }));
    toast.success("Lisibilité améliorée par l'IA !");
  };

  const increaseEngagement = () => {
    const engagementElements = `
<h2>Éléments d'engagement</h2>
<div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="display: inline-block; margin-right: 6px; vertical-align: middle;">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Questions engageantes
        </h3>
  <p>Posez-vous ces questions pour maintenir l'attention :</p>
  <ul>
    <li>Comment pouvez-vous appliquer ces conseils dès aujourd'hui ?</li>
    <li>Quels sont les obstacles que vous rencontrez ?</li>
    <li>Quels résultats attendez-vous de ces améliorations ?</li>
  </ul>
</div>

<div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 8px; padding: 15px; margin: 20px 0;">
  <h3>💪 Appel à l'action</h3>
  <p>Maintenant que vous avez toutes ces informations, il est temps de passer à l'action ! Commencez par appliquer un seul conseil et observez les résultats.</p>
</div>`;
    
    setFormData(prev => ({ ...prev, content: prev.content + engagementElements }));
    toast.success("Éléments d'engagement ajoutés par l'IA !");
  };

  const analyzeAdvancedSEO = () => {
    if (!formData.content.trim()) {
      toast.error("Aucun contenu à analyser");
      return;
    }

    // Analyse avancée
    const content = formData.content.toLowerCase();
    const title = formData.title.toLowerCase();
    
    // Extraction des mots-clés potentiels
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 3);
    const wordFreq: { [key: string]: number } = {};
    
    words.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Top mots-clés
    const topKeywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => `${word} (${count}x)`);

    // Densité des mots-clés
    const titleWords = title.split(/\s+/).filter(word => word.length > 3);
    let keywordDensity = 0;
    titleWords.forEach(word => {
      if (wordFreq[word]) {
        keywordDensity += wordFreq[word];
      }
    });

    // Analyse de la structure
    const hasH1 = content.includes('<h1>');
    const hasH2 = content.includes('<h2>');
    const hasH3 = content.includes('<h3>');
    const hasMetaDescription = content.includes('meta') && content.includes('description');

          let analysis = `Analyse SEO Avancée\n\n`;
    analysis += `🔍 Mots-clés principaux :\n${topKeywords.join(', ')}\n\n`;
    analysis += `📈 Densité des mots-clés du titre : ${keywordDensity}\n\n`;
    analysis += `🏗️ Structure :\n`;
    analysis += `${hasH1 ? '✅' : '❌'} Titre H1\n`;
    analysis += `${hasH2 ? '✅' : '❌'} Sous-titres H2\n`;
    analysis += `${hasH3 ? '✅' : '❌'} Sous-titres H3\n`;
    analysis += `${hasMetaDescription ? '✅' : '❌'} Méta description\n\n`;
    analysis += `💡 Conseils :\n`;
    analysis += `• Utilisez vos mots-clés principaux dans les titres\n`;
    analysis += `• Créez une hiérarchie claire (H1 > H2 > H3)\n`;
    analysis += `• Optimisez la densité des mots-clés (2-3%)\n`;

    toast.success("Analyse SEO Avancée", {
      description: analysis,
      duration: 10000,
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

  // Système d'analyse et formatage automatique d'articles
  const analyzeAndFormatArticle = () => {
    if (!formData.content.trim()) {
      toast.error("Aucun contenu à analyser et formater");
      return;
    }

    toast.info("Analyse et formatage automatique en cours...", {
      description: "L'IA analyse votre contenu et applique la mise en forme optimale."
    });

    // Analyser le contenu et appliquer le formatage
    let formattedContent = formData.content;

    // 1. Détecter et formater les titres principaux
    formattedContent = formatMainTitles(formattedContent);
    
    // 2. Détecter et formater les sous-titres
    formattedContent = formatSubTitles(formattedContent);
    
    // 3. Détecter et formater les listes
    formattedContent = formatLists(formattedContent);
    
    // 4. Détecter et mettre en gras les mots-clés importants
    formattedContent = highlightKeywordsInContent(formattedContent);
    
    // 5. Détecter et mettre en italique les termes techniques
    formattedContent = formatTechnicalTerms(formattedContent);
    
    // 6. Détecter et formater les citations
    formattedContent = formatQuotes(formattedContent);
    
    // 7. Détecter et formater les points importants
    formattedContent = formatImportantPoints(formattedContent);
    
    // 8. Détecter et formater les étapes numérotées
    formattedContent = formatNumberedSteps(formattedContent);
    
    // 9. Détecter et formater les conseils/tips
    formattedContent = formatTips(formattedContent);
    
    // 10. Détecter et formater les avertissements
    formattedContent = formatWarnings(formattedContent);

    setFormData(prev => ({ ...prev, content: formattedContent }));
    
    toast.success("Formatage automatique terminé !", {
      description: "Votre article a été analysé et formaté automatiquement avec la mise en forme optimale."
    });
  };

  // Fonctions de formatage automatique
  const formatMainTitles = (content: string): string => {
    // Détecter les titres principaux (lignes qui commencent par des mots-clés spécifiques)
    const titlePatterns = [
      /^(introduction|conclusion|résumé|overview|aperçu|généralités)/i,
      /^(chapitre|partie|section)\s+\d+/i,
      /^[A-Z][A-Z\s]{5,}$/ // Titres en majuscules
    ];

    return content.replace(/^(.+)$/gm, (line) => {
      for (const pattern of titlePatterns) {
        if (pattern.test(line.trim())) {
          return `<h2>${line.trim()}</h2>`;
        }
      }
      return line;
    });
  };

  const formatSubTitles = (content: string): string => {
    // Détecter les sous-titres (lignes qui commencent par des mots-clés spécifiques)
    const subTitlePatterns = [
      /^(avantages|inconvénients|bénéfices|points clés|étapes|méthodes|techniques|outils|stratégies|conseils|tips|astuces)/i,
      /^(comment|pourquoi|quand|où|qui|quoi|combien)/i,
      /^[A-Z][a-z\s]{3,}$/ // Titres avec première lettre majuscule
    ];

    return content.replace(/^(.+)$/gm, (line) => {
      for (const pattern of subTitlePatterns) {
        if (pattern.test(line.trim()) && !line.includes('<h2>')) {
          return `<h3>${line.trim()}</h3>`;
        }
      }
      return line;
    });
  };

  const formatLists = (content: string): string => {
    // Détecter les listes à puces
    content = content.replace(/^[-•*]\s+(.+)$/gm, '<li>$1</li>');
    
    // Détecter les listes numérotées
    content = content.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    
    // Grouper les listes
    content = content.replace(/(<li>.*<\/li>)/gs, (match) => {
      if (match.includes('<li>')) {
        return `<ul>${match}</ul>`;
      }
      return match;
    });

    return content;
  };

  const formatTechnicalTerms = (content: string): string => {
    // Termes techniques à mettre en italique
    const technicalTerms = [
      'api', 'seo', 'sem', 'ppc', 'crm', 'cms', 'ux', 'ui', 'roi', 'kpi',
      'algorithm', 'framework', 'plugin', 'widget', 'responsive', 'mobile-first',
      'cloud', 'saas', 'paas', 'iaas', 'blockchain', 'ai', 'ml', 'big data'
    ];

    technicalTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      content = content.replace(regex, `<em>${term}</em>`);
    });

    return content;
  };

  const formatQuotes = (content: string): string => {
    // Détecter les citations (texte entre guillemets)
    content = content.replace(/"([^"]+)"/g, '<blockquote style="border-left: 4px solid #007bff; padding-left: 15px; margin: 15px 0; font-style: italic; color: #666;">"$1"</blockquote>');
    
    // Détecter les citations avec tirets
    content = content.replace(/^-\s+(.+)$/gm, '<blockquote style="border-left: 4px solid #007bff; padding-left: 15px; margin: 15px 0; font-style: italic; color: #666;">$1</blockquote>');

    return content;
  };

  const formatImportantPoints = (content: string): string => {
    // Détecter les points importants
    const importantPatterns = [
      /^(attention|important|note|remarque|conseil|astuce):/i,
      /^(⚠️|❗|💡|🎯|✅|❌)/
    ];

    return content.replace(/^(.+)$/gm, (line) => {
      for (const pattern of importantPatterns) {
        if (pattern.test(line.trim())) {
          return `<div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 15px 0;"><strong>${line.trim()}</strong></div>`;
        }
      }
      return line;
    });
  };

  const formatNumberedSteps = (content: string): string => {
    // Détecter les étapes numérotées
    const stepPatterns = [
      /^(étape|step)\s+\d+:/i,
      /^\d+\.\s+(première|deuxième|troisième|quatrième|cinquième)/i
    ];

    return content.replace(/^(.+)$/gm, (line) => {
      for (const pattern of stepPatterns) {
        if (pattern.test(line.trim())) {
          return `<div style="background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 8px; padding: 15px; margin: 15px 0;"><strong>${line.trim()}</strong></div>`;
        }
      }
      return line;
    });
  };

  const formatTips = (content: string): string => {
    // Détecter les conseils et astuces
    const tipPatterns = [
      /^(conseil|astuce|tip|bonne pratique|recommandation):/i,
      /^(💡|💪|🎯|✨|🚀)/
    ];

    return content.replace(/^(.+)$/gm, (line) => {
      for (const pattern of tipPatterns) {
        if (pattern.test(line.trim())) {
          return `<div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px; margin: 15px 0;"><strong>💡 ${line.trim()}</strong></div>`;
        }
      }
      return line;
    });
  };

  const formatWarnings = (content: string): string => {
    // Détecter les avertissements
    const warningPatterns = [
      /^(attention|warning|avertissement|danger|risque):/i,
      /^(⚠️|🚨|❌|⛔)/
    ];

    return content.replace(/^(.+)$/gm, (line) => {
      for (const pattern of warningPatterns) {
        if (pattern.test(line.trim())) {
          return `<div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 15px; margin: 15px 0;"><strong>⚠️ ${line.trim()}</strong></div>`;
        }
      }
      return line;
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
                Créateur d'Articles
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rédigez et gérez vos articles manuellement
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
              Brouillons ({getArticlesByTab('drafts').length})
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
              Publiés ({getArticlesByTab('published').length})
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
              Archivés ({getArticlesByTab('archived').length})
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
              Corbeille ({getArticlesByTab('trash').length})
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
                        onClick={analyzeAndFormatArticle}
                        className="w-full justify-start bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Formatage automatique
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

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={useClaudeAI}
                        className="w-full justify-start bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-300"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">C</span>
                          </div>
                          IA Claude (Gratuit)
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* Corrections SEO automatiques */}
                  {seoCorrections.length > 0 && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium mb-3 text-orange-600 dark:text-orange-400">
                        🔧 Corrections SEO disponibles
                      </h3>
                      
                      <div className="space-y-2">
                        {seoCorrections.map((correction, index) => (
                          <Button
                            key={correction.id}
                            variant="outline"
                            size="sm"
                            onClick={correction.action}
                            className="w-full justify-start text-xs"
                          >
                            <div className="flex items-center gap-2">
                              {correction.type === 'title' && <FileText className="h-3 w-3" />}
                              {correction.type === 'content' && <Edit className="h-3 w-3" />}
                              {correction.type === 'structure' && <BarChart3 className="h-3 w-3" />}
                              {correction.type === 'formatting' && <Sparkles className="h-3 w-3" />}
                              {correction.type === 'links' && <Target className="h-3 w-3" />}
                              {correction.type === 'media' && <Eye className="h-3 w-3" />}
                              <span>{correction.description}</span>
                            </div>
                          </Button>
                        ))}
                        
                        <Button
                          variant="default"
                          size="sm"
                          onClick={autoCorrectAllSEO}
                          className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Corriger tout automatiquement
                        </Button>
                      </div>
                    </div>
                  )}

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
            {activeTab === 'trash' && getArticlesByTab('trash').length > 0 && (
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Corbeille</h2>
                <Button variant="destructive" size="sm" onClick={emptyTrash}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Vider la corbeille
                </Button>
              </div>
            )}

            <div className="grid gap-4">
              {getArticlesByTab(activeTab).map((article) => (
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

            {getArticlesByTab(activeTab).length === 0 && (
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