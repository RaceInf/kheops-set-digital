import React, { useState, useEffect, useRef } from 'react';
import DemographicChart from './DemographicChart';
import RoiPerformanceChart from './RoiPerformanceChart';
import EngagementChart from './EngagementChart';
import FeatureComparison from './FeatureComparison';
import FAQAccordion from './FAQAccordion';
import { ArrowLeft, Share2, Twitter, Linkedin, Facebook, ChevronUp, Eye, Clock, Calendar, User, Maximize2, X, Menu, ChevronLeft, BookOpen, Plus, Heart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { onArticleStatsChange, incrementViews, incrementLikes } from '@/lib/firebase';
import LikeButton from '@/components/LikeButton';
import { blogPosts } from '@/data/blogPosts';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import ReactGA from 'react-ga4';
import { sendGA4ServerEvent } from '@/lib/ga4ServerEvent';
// import { useTheme } from '../contexts/ThemeContext'; // À adapter selon la gestion du thème

interface ArticlePageProps {
  article?: {
    id: string;
    slug?: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    publishDate: string;
    readTime: string;
    category: string;
    tags: string[];
  };
}

// Fonction utilitaire pour générer des slugs
function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Fonction utilitaire pour extraire les titres du contenu HTML
function extractHeadingsFromHtml(html: string) {
  if (!html) return [];
  
  const div = document.createElement('div');
  div.innerHTML = html;
  
  const headings = Array.from(div.querySelectorAll('h2'))
    .map(el => {
      const text = el.textContent || '';
      return {
        id: slugify(text),
        text: text,
        level: el.tagName,
      };
    })
    .filter(heading => heading.text.trim().length > 0); // Filtrer les titres vides
    
  return headings;
}

// Fonction pour remplacer la table démographique par un composant React
// Split content around a table whose caption contains a specific marker
function splitContentByCaption(html: string, captionMarker: string) {
    const captionIndex = html.indexOf(captionMarker);
  if (captionIndex === -1) return null;
  // Search backwards from caption to find the opening <table
  const tableStart = html.lastIndexOf('<table', captionIndex);
  if (tableStart === -1) return null;
  // Search forward from caption to find the closing </table>
  const tableEnd = html.indexOf('</table>', captionIndex);
  if (tableEnd === -1) return null;
  const before = html.substring(0, tableStart);
  const after = html.substring(tableEnd + '</table>'.length);
  return { before, after };
}

// Split content right after the "Monétisation en développement" paragraph
function splitMonetization(html: string) {
  const marker = '<p><strong>Monétisation en développement';
  const pStart = html.indexOf(marker);
  if (pStart === -1) return null;
  const pEnd = html.indexOf('</p>', pStart);
  if (pEnd === -1) return null;
  const before = html.substring(0, pEnd + 4);
  const after = html.substring(pEnd + 4);
  return { before, after };
}

// Convenience wrappers
const splitDemographic = (html: string) => splitContentByCaption(html,'Répartition démographique des utilisateurs');
const splitRoi = (html: string) => splitContentByCaption(html,'Comparatif ROI');

// Split around mermaid engagement diagram
function splitEngagement(html: string) {
  const marker = 'Diagramme à barres horizontales';
  const markerIndex = html.indexOf(marker);
  if (markerIndex === -1) return null;
  const preStart = html.lastIndexOf('<pre', markerIndex);
  if (preStart === -1) return null;
  const preEnd = html.indexOf('</pre>', markerIndex);
  if (preEnd === -1) return null;
  const before = html.substring(0, preStart);
  const after = html.substring(preEnd + '</pre>'.length);
  return { before, after };
}



// Fonction pour injecter les id dans le HTML avant affichage
function addIdsToHeadings(html: string) {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  Array.from(div.querySelectorAll('h2, h3')).forEach((el) => {
    const text = el.textContent;
    if (text) {
      el.id = slugify(text);
    }
  });
  return div.innerHTML;
}

const ArticlePage = ({ article }: ArticlePageProps) => {
  const [progress, setProgress] = useState(0);
  const [tocVisible, setTocVisible] = useState(false);
  const [fontSize, setFontSize] = useState(1.125);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const parallaxRef = useRef<HTMLImageElement | null>(null);
  const articleRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  // Référence pour s'assurer que Mermaid n'est initialisé qu'une seule fois
  const mermaidInitRef = useRef(false);

  // Hook pour détecter la largeur de l'écran
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calcul de la progression de lecture
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(scrollPercent, 100));
    };
    const handleScroll = () => {
      updateProgress();
      if (parallaxRef.current) {
        const scrollTop = window.pageYOffset;
        const rate = scrollTop * -0.3;
        parallaxRef.current.style.transform = `translateY(${rate}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    updateProgress();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rendu et initialisation Mermaid pour les balises <pre class="mermaid">
  useEffect(() => {
    const renderMermaid = async () => {
      const mermaid = await import('mermaid');
      if (!mermaidInitRef.current) {
        mermaid.default.initialize({ startOnLoad: false, securityLevel: 'loose', theme: 'default' });
        mermaidInitRef.current = true;
      }
      try {
        mermaid.default.init(undefined, document.querySelectorAll('pre.mermaid'));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Mermaid render error:', error);
      }
    };
    if (typeof window !== 'undefined') {
      renderMermaid();
    }
  }, [article?.content]);

  const { toast } = useToast();
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    
    // Tracking GA4 pour le partage par copie de lien
    ReactGA.event({
      category: 'KheopScope Article',
      action: 'Share Article',
      label: 'Copy Link',
      value: 1
    });

    sendGA4ServerEvent({
      eventName: 'article_share',
      params: {
        article_id: articleId,
        article_title: articleTitle,
        share_method: 'copy_link',
        page_location: window.location.href,
        custom_parameter_1: 'kheopscope_article'
      }
    });

    toast({ title: "Lien copié !", description: "Le lien de l'article a été copié dans le presse-papier." });
    setShareMenuOpen(false);
  };
  
  const handleShareSocial = (network: 'twitter' | 'facebook' | 'linkedin') => {
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(articleUrl);
    const encodedTitle = encodeURIComponent(articleTitle);
    if (network === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    if (network === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    if (network === 'linkedin') shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
    
    // Tracking GA4 pour le partage social
    ReactGA.event({
      category: 'KheopScope Article',
      action: 'Share Article',
      label: network,
      value: 1
    });

    sendGA4ServerEvent({
      eventName: 'article_share',
      params: {
        article_id: articleId,
        article_title: articleTitle,
        share_method: network,
        page_location: window.location.href,
        custom_parameter_1: 'kheopscope_article'
      }
    });

    window.open(shareUrl, '_blank', 'noopener');
    setShareMenuOpen(false);
  };

  // Navigation fluide
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTocVisible(false);
    }
  };

  // Gestion de la taille de police
  const adjustFontSize = () => {
    const newSize = fontSize >= 1.5 ? 1 : fontSize + 0.125;
    setFontSize(newSize);
  };

  // Fermer le menu si clic en dehors
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // --- Ajout pour stats dynamiques ---
  const articleId = article?.id;
  const articleTitle = article?.title || document.title;
  const [articleStats, setArticleStats] = useState<{ likes: number; views: number }>({ likes: 0, views: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  
  // Toujours afficher le compteur depuis Firebase
  const displayLikes = articleStats.likes;

  useEffect(() => {
    if (articleId) {
      const likedStatus = localStorage.getItem(`liked_${articleId}`);
      setIsLiked(likedStatus === 'true');
    }
  }, [articleId]);

  const handleLike = async () => {
    if (isLiking || isLiked || !articleId) return;

    setIsLiking(true);
    
    try {
      // Envoyer le like à Firebase
      await incrementLikes(articleId);
      
      // Mettre à jour l'état local après confirmation de Firebase
      // Synchronisation gérée par le listener temps réel
      
      setIsLiked(true);
      localStorage.setItem(`liked_${articleId}`, 'true');

      // Tracking GA4 pour le like d'article
      ReactGA.event({
        category: 'KheopScope Article',
        action: 'Like Article',
        label: articleTitle,
        value: 1
      });

      sendGA4ServerEvent({
        eventName: 'article_like',
        params: {
          article_id: articleId,
          article_title: articleTitle,
          page_location: window.location.href,
          custom_parameter_1: 'kheopscope_article'
        }
      });

    } catch (error) {
      console.error("Erreur lors de l'ajout du like :", error);
      
      toast({
        title: "Erreur",
        description: "Impossible d'aimer l'article. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  // Table des matières dynamique
  const [headings, setHeadings] = useState<{id: string, text: string, level: string}[]>([]);
  useEffect(() => {
    if (article?.content) {
      setHeadings(extractHeadingsFromHtml(article.content));
    } else {
      setHeadings([]);
    }
  }, [article?.content]);

  useEffect(() => {
    if (!articleId) return;

    // Incrémenter les vues une seule fois
    const viewKey = `viewed_${articleId}`;
    if (!sessionStorage.getItem(viewKey)) {
      incrementViews(articleId);
      sessionStorage.setItem(viewKey, 'true');
    }
  }, [articleId]);

  // Écouter les mises à jour en temps réel des statistiques
  useEffect(() => {
    if (!articleId) return;

    const unsubscribe = onArticleStatsChange(articleId, (newStats) => {
      setArticleStats(newStats);
    });

    return () => unsubscribe();
  }, [articleId]);

  useEffect(() => {
    // Accordéon FAQ : une seule question ouverte à la fois
    const faqSection = document.querySelector('.faq-section');
    if (!faqSection) return;
    const details = faqSection.querySelectorAll('.faq-item');
    
    const handleToggle = function (this: HTMLDetailsElement) {
      if (this.open) {
        details.forEach((other) => {
          if (other !== this) (other as HTMLDetailsElement).open = false;
        });
      }
    };
    
    details.forEach((item) => {
      item.addEventListener('toggle', handleToggle);
    });
    
    // Nettoyage
    return () => {
      details.forEach((item) => {
        item.removeEventListener('toggle', handleToggle);
      });
    };
  }, []);

  // Gestion du titre de la page
  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} | Kheopscope`;
    } else {
      document.title = 'Kheopscope';
    }
    
    // Restaurer le titre original quand on quitte la page
    return () => {
      document.title = 'Kheopscope';
    };
  }, [article?.title]);
  // --- Fin ajout stats dynamiques ---

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="article-reader">
      <style>{`
        .article-reader {
          --primary-color: #eb7e78;
          --secondary-color: #edc070;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --text-muted: #9ca3af;
          --bg-primary: #ffffff;
          --bg-secondary: #f9fafb;
          --border-color: #e5e7eb;
          --accent-color: #edc070;
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .article-reader.dark-mode {
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --text-muted: #9ca3af;
          --bg-primary: #111827;
          --bg-secondary: #1f2937;
          --border-color: #374151;
        }

        .container {
          @apply container mx-auto px-4 max-w-7xl;
          margin-top: 0;
          padding-top: 2rem;
          padding-bottom: 6rem;
          border-radius: 1rem;
          box-shadow: var(--shadow);
        }

        .container-custom {
          background: var(--bg-primary) !important;
        }

        .article-header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .article-category {
          display: inline-block;
          background: var(--accent-color);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .article-title, h1, h2, h3, h4, h5, h6 {
          font-family: 'Montserrat', 'Open Sans', Arial, sans-serif;
          font-weight: 700;
          color: var(--primary-color);
        }
        .article-title {
          font-size: clamp(2.2rem, 7vw, 3.8rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .article-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          font-weight: 400;
          margin-bottom: 2rem;
        }

        .article-meta {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .meta-item svg {
          color: var(--secondary-color);
        }

        .meta-item span {
          font-family: 'Open Sans', Arial, sans-serif;
          font-weight: 400;
        }

        .author-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
        }

        .article-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 1rem;
          margin-bottom: 3rem;
          box-shadow: var(--shadow-lg);
          transition: transform 0.3s ease;
        }

        .article-image:hover {
          transform: scale(1.02);
        }

        .article-content {
          font-family: 'Open Sans', Arial, sans-serif;
          font-weight: 400;
          color: var(--text-primary);
          font-size: ${fontSize}rem;
          line-height: 1.8;
          h1, h2, h3, h4, h5, h6 {
            color: var(--text-primary);
            margin-top: 2em;
            margin-bottom: 1em;
            line-height: 1.3;
          }
          .article-intro {
            font-size: 1.1em;
            color: var(--text-primary);
            line-height: 1.6;
            margin-bottom: 2rem;
          }
          .custom-list {
            list-style: none;
            padding-left: 0;
          }
          .custom-list li {
            background-color: var(--bg-secondary);
            border-left: 4px solid var(--primary-color);
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 0 8px 8px 0;
          }
          .faq-section {
            margin-top: 3rem;
            border-top: 1px solid var(--border-color);
            padding-top: 2rem;
          }
          .faq-section h2 {
            text-align: left;
            margin-bottom: 2rem;
          }
          .faq-item {
            border-bottom: 1px solid var(--border-color);
            padding: 1.5rem 0;
            cursor: pointer;
          }
          .faq-item summary {
            font-weight: 600;
            font-size: 1.1rem;
            color: var(--text-primary);
            position: relative;
            padding-right: 2rem; /* Espace pour l'icône */
            list-style: none; /* Hide default marker */
          }
          .faq-item summary::-webkit-details-marker {
            display: none; /* Hide default marker for Chrome/Safari */
          }
          .faq-item summary::after {
            content: '+';
            font-size: 1.5rem;
            color: var(--primary-color);
            transition: transform 0.3s ease;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%) rotate(0deg);
          }
          .faq-item[open] summary::after {
            transform: translateY(-50%) rotate(45deg);
          }
          .faq-item p {
            padding-top: 1rem;
            margin-bottom: 0;
            color: var(--text-secondary);
            line-height: 1.7;
          }
        }

        /* --- NOUVEAU STYLE DE LISTES & TITRES --- */

        .article-content h2 {
          position: relative;
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .article-content h2::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 70px;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
          border-radius: 3px;
        }

        .article-content .custom-list li {
          list-style: none;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1rem;
          border-radius: 8px;
          border-left-width: 5px;
          border-left-style: solid;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .article-content .custom-list li:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.07);
        }

        /* Couleurs pour chaque section */
        .article-content h2:nth-of-type(1) + .custom-list li {
          border-color: #06b6d4; /* Cyan */
          background-color: #ecfeff;
        }
        .article-content h2:nth-of-type(2) + .custom-list li {
          border-color: #8b5cf6; /* Violet */
          background-color: #f5f3ff;
        }
        .article-content h2:nth-of-type(3) + .custom-list li {
          border-color: #db2777; /* Rose */
          background-color: #fdf2f8;
        }
        .article-content h2:nth-of-type(4) + .custom-list li {
          border-color: #16a34a; /* Vert */
          background-color: #f0fdf4;
        }
        .article-content h2:nth-of-type(5) + .custom-list li {
          border-color: #ea580c; /* Orange */
          background-color: #fff7ed;
        }
        
        .dark-mode .article-content h2:nth-of-type(1) + .custom-list li {
          background-color: rgba(6, 182, 212, 0.1);
        }
        .dark-mode .article-content h2:nth-of-type(2) + .custom-list li {
          background-color: rgba(139, 92, 246, 0.1);
        }
        .dark-mode .article-content h2:nth-of-type(3) + .custom-list li {
          background-color: rgba(219, 39, 119, 0.1);
        }
        .dark-mode .article-content h2:nth-of-type(4) + .custom-list li {
          background-color: rgba(22, 163, 74, 0.1);
        }
        .dark-mode .article-content h2:nth-of-type(5) + .custom-list li {
          background-color: rgba(234, 88, 12, 0.1);
        }
        /* --- FIN NOUVEAU STYLE --- */

        .article-content p {
          margin-bottom: 1.5rem;
        }

        .article-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 2.5rem 0 1rem 0;
          color: var(--text-primary);
        }

        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 2rem 0 1rem 0;
          color: var(--text-primary);
        }

        .content-section {
          margin: 3rem 0;
          position: relative;
        }

        .image-left-section,
        .image-right-section {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 3rem;
          align-items: center;
        }

        .section-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 1rem;
          box-shadow: var(--shadow-lg);
          transition: all 0.3s ease;
        }

        .section-image:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .floating-image {
          width: 400px;
          height: 250px;
          object-fit: cover;
          border-radius: 1rem;
          box-shadow: var(--shadow-lg);
          float: right;
          margin: 0 0 2rem 2rem;
          transition: all 0.3s ease;
        }

        .floating-image:hover {
          transform: rotate(2deg) scale(1.05);
        }

        .image-caption {
          color: var(--secondary-color);
          font-family: 'Open Sans', Arial, sans-serif;
          font-size: 0.75rem;
          text-align: center;
          margin-top: 0.25rem;
          font-style: italic;
          opacity: 0.8;
          line-height: 1.4;
        }

        .parallax-container {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
          height: 300px;
          margin: 3rem 0;
        }

        .parallax-image {
          position: absolute;
          top: -20%;
          left: 0;
          width: 100%;
          height: 120%;
          object-fit: cover;
        }

        .parallax-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          color: white;
          padding: 2rem;
          border-radius: 0 0 1rem 1rem;
        }

        .parallax-overlay h3 {
          margin: 0 0 0.5rem 0;
          color: white;
        }

        .quote, blockquote {
          position: relative;
          padding: 1.5rem 2rem 1.5rem 3.5rem;
          margin: 3rem 0;
          background-color: var(--bg-secondary);
          border-radius: 8px;
          font-family: 'Georgia', serif;
          font-size: 1.2rem;
          line-height: 1.6;
          color: var(--text-primary);
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          border-left: 5px solid;
          border-image-slice: 1;
          border-image-source: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
        }
        
        .quote::before, blockquote::before {
          content: '“';
          font-family: 'Georgia', serif;
          font-size: 5rem;
          color: var(--primary-color);
          opacity: 0.5;
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          line-height: 1;
        }

        .quote footer, blockquote footer {
          margin-top: 1rem;
          text-align: right;
          font-family: 'Open Sans', sans-serif;
          font-style: normal;
          font-weight: 600;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .floating-actions {
          position: fixed;
          left: 2rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 50;
        }

        .floating-btn {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: var(--shadow);
          color: var(--text-secondary);
        }

        .floating-btn:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-lg);
          color: var(--primary-color);
        }

        .floating-btn.bookmarked {
          color: gold;
        }

        .reading-progress {
          position: fixed;
          bottom: 2rem;
          left: 2rem;
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          background: var(--bg-primary);
          border: 3px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--primary-color);
          box-shadow: var(--shadow-lg);
          z-index: 50;
        }

        .toc {
          position: fixed;
          left: 2rem;
          top: 50%;
          transform: translateY(-50%);
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          padding: 1rem;
          max-width: 200px;
          box-shadow: var(--shadow);
          opacity: ${tocVisible ? 1 : 0};
          pointer-events: ${tocVisible ? 'all' : 'none'};
          transition: all 0.3s ease;
          z-index: 50;
        }

        .toc h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .toc ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .toc li {
          margin-bottom: 0.25rem;
        }

        .toc button {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.75rem;
          cursor: pointer;
          transition: color 0.2s ease;
          text-align: left;
          padding: 0;
        }

        .toc button:hover {
          color: var(--primary-color);
        }

        .mobile-actions-menu {
          position: absolute;
          top: 3.5rem;
          right: 0;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          min-width: 180px;
          z-index: 100;
        }
        .mobile-action {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1rem;
          padding: 1rem 1.5rem;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .mobile-action:hover {
          background: var(--bg-secondary);
          color: var(--primary-color);
        }
        @media (max-width: 1023px) {
          .floating-actions {
            left: 1rem;
            top: auto;
            bottom: 2rem;
            transform: none;
          }
        }
        .menu-btn-mobile {
          background: var(--bg-primary);
          border: 2px solid var(--primary-color);
          color: var(--primary-color);
          width: 3.5rem;
          height: 3.5rem;
          box-shadow: 0 4px 16px rgba(37,99,235,0.10);
          font-size: 1.5rem;
          transition: box-shadow 0.2s, background 0.2s, color 0.2s;
          position: relative;
        }
        .menu-btn-mobile.active,
        .menu-btn-mobile:active,
        .menu-btn-mobile:focus {
          background: var(--primary-color);
          color: #fff;
          box-shadow: 0 8px 32px rgba(37,99,235,0.18);
          outline: none;
        }
        .menu-btn-mobile:hover {
          background: var(--primary-color);
          color: #fff;
        }
        .mobile-menu-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(31,41,55,0.25);
          z-index: 99;
          animation: fadeInBackdrop 0.2s;
        }
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .mobile-actions-menu.menu-up {
          bottom: 3.5rem;
          top: auto;
          right: 0;
          left: auto;
        }
        .mobile-actions-menu.menu-up.animated {
          animation: fadeInMenuUp 0.22s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInMenuUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .floating-actions-mobile {
          position: fixed;
          left: 1rem;
          top: 50%;
          bottom: auto;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 50;
        }
        .floating-btn-mobile {
          width: 2.5rem;
          height: 2.5rem;
          font-size: 1.1rem;
        }
        @media (max-width: 1023px) {
          .floating-actions {
            left: 1rem;
            top: auto;
            bottom: 2rem;
            transform: none;
            flex-direction: column;
            gap: 0.25rem;
          }
          .floating-btn {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1.1rem;
          }
        }
        @media (max-width: 768px) {
          .container-custom {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: var(--bg-primary) !important;
            max-width: 100vw !important;
          }
          .article-header {
            margin-bottom: 1.5rem;
          }
          .article-title {
            font-size: 2rem !important;
            margin-bottom: 0.5rem !important;
          }
          .article-subtitle {
            font-size: 1rem !important;
            margin-bottom: 1rem !important;
          }
          .article-meta {
            gap: 1rem !important;
            font-size: 0.9rem !important;
          }
          .article-image {
            height: 180px !important;
            border-radius: 0.5rem !important;
            margin-bottom: 1.5rem !important;
          }
          .article-content {
            font-size: 1rem !important;
          }
          .content-section {
            margin: 2rem 0 !important;
          }
          .image-left-section {
            display: flex !important;
            flex-direction: column-reverse !important;
          }
          .image-right-section {
            display: flex !important;
            flex-direction: column !important;
            gap: 1rem !important;
          }
          .section-image {
            height: 140px !important;
            border-radius: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          .image-caption {
            font-size: 0.85rem !important;
            margin-bottom: 0.5rem !important;
          }
          .section-content {
            padding: 0 !important;
          }
          .quote {
            font-size: 1rem !important;
            padding: 1rem !important;
            margin: 1rem 0 !important;
          }
          .quote::before {
            font-size: 2.2rem !important;
            left: 0.5rem !important;
          }
          .faq-item summary {
            font-size: 1rem !important;
          }
          .faq-item p {
            font-size: 0.95rem !important;
          }
        }
        @media (max-width: 1024px) {
          .container-custom {
            background: var(--bg-primary) !important;
          }
        }
        .float-image-wrapper {
          float: left;
          width: 420px;
          max-width: 80vw;
          margin-right: 3rem;
          margin-bottom: 1rem;
        }
        .float-image-title {
          width: 100%;
          height: auto;
          border-radius: 1.5rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          object-fit: cover;
          display: block;
        }
        @media (max-width: 900px) {
          .float-image-wrapper {
            float: none;
            width: 100%;
            max-width: 100%;
            margin: 0 auto 1rem auto;
          }
        }
        .float-image-wrapper-right {
          float: right;
          width: 420px;
          max-width: 80vw;
          margin-left: 3rem;
          margin-bottom: 1rem;
        }
        .float-image-title-right {
          width: 100%;
          height: auto;
          border-radius: 1.5rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          object-fit: cover;
          display: block;
        }
        @media (max-width: 900px) {
          .float-image-wrapper-right {
            float: none;
            width: 100%;
            max-width: 100%;
            margin: 0 auto 1rem auto;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.25s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-soft-pulse {
          animation: soft-pulse 2s infinite;
        }
        @keyframes soft-pulse {
          0% { box-shadow: 0 0 0 0 rgba(237, 192, 112, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(237, 192, 112, 0); }
          100% { box-shadow: 0 0 0 0 rgba(237, 192, 112, 0); }
        }
      `}</style>

      {/* Actions flottantes desktop */}
      {!isMobile && (
        <div className="floating-actions">
          <Popover open={tocVisible} onOpenChange={setTocVisible}>
            <PopoverTrigger asChild>
              <div className="floating-btn" onClick={() => setTocVisible(!tocVisible)} title="Sommaire">
                <BookOpen className="w-5 h-5" />
              </div>
            </PopoverTrigger>
            <PopoverContent align="end" side="right" sideOffset={8} className="p-4 w-64">
              <h4 className="font-bold text-kheops-blue mb-2 text-sm">Table des matières</h4>
              <ul className="space-y-1">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <button
                      className="text-left text-xs text-gray-700 hover:text-kheops-salmon transition-colors w-full"
                      onClick={() => { scrollToSection(heading.id); setTocVisible(false); }}
                    >
                      {heading.text}
                    </button>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>

          <Popover open={shareMenuOpen} onOpenChange={setShareMenuOpen}>
            <PopoverTrigger asChild>
              <div className="floating-btn" title="Partager">
                <Share2 className="w-5 h-5" />
              </div>
            </PopoverTrigger>
            <PopoverContent align="end" side="right" sideOffset={8} className="p-2 w-48">
              <div className="flex flex-col space-y-1">
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-kheops-gold/20 rounded transition" onClick={() => handleShareSocial('twitter')}>
                  <Twitter className="w-4 h-4 text-[#1DA1F2]" /> Twitter
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-kheops-gold/20 rounded transition" onClick={() => handleShareSocial('facebook')}>
                  <Facebook className="w-4 h-4 text-[#1877F3]" /> Facebook
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-kheops-gold/20 rounded transition" onClick={() => handleShareSocial('linkedin')}>
                  <Linkedin className="w-4 h-4 text-[#0077B5]" /> LinkedIn
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-kheops-gold/20 rounded transition" onClick={handleCopyLink}>
                  <BookOpen className="w-4 h-4 text-kheops-gold" /> Copier le lien
                </button>
              </div>
            </PopoverContent>
          </Popover>
          <div className="floating-btn" onClick={adjustFontSize} title="Taille de police">
            <Maximize2 className="w-5 h-5" />
          </div>
          {articleId && (
          <LikeButton articleId={articleId} initialCount={displayLikes} className="floating-btn" showCount={false} iconClassName="w-5 h-5" />
          )}

        </div>
      )}

      {/* Actions flottantes mobile/tablette : trois boutons à droite, taille réduite */}
      {isMobile && (
        <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start">
          {/* Boutons secondaires, affichés au-dessus si menu ouvert */}
          {mobileMenuOpen && (
            <div className="flex flex-col items-start mb-2 space-y-3 animate-fade-in-up">
              {/* Bouton J'aime */}
              {articleId && (
                <div 
                  className="floating-btn floating-btn-mobile" 
                  onClick={() => {
                    handleLike();
                    setMobileMenuOpen(false);
                  }}
                  title="J'aime"
                >
                  <Heart 
                    className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : ''}`} 
                  />
                </div>
              )}

              <Popover open={shareMenuOpen} onOpenChange={setShareMenuOpen}>
                <PopoverTrigger asChild>
                  <div className="floating-btn floating-btn-mobile" title="Partager">
                    <Share2 className="w-5 h-5" />
                  </div>
                </PopoverTrigger>
                <PopoverContent align="end" side="right" sideOffset={8} className="p-2 w-48">
                  <div className="flex flex-col space-y-1">
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-kheops-gold/20 rounded transition" onClick={() => handleShareSocial('twitter')}>
                      <Twitter className="w-4 h-4 text-[#1DA1F2]" /> Twitter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-kheops-gold/20 rounded transition" onClick={() => handleShareSocial('facebook')}>
                      <Facebook className="w-4 h-4 text-[#1877F3]" /> Facebook
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-kheops-gold/20 rounded transition" onClick={() => handleShareSocial('linkedin')}>
                      <Linkedin className="w-4 h-4 text-[#0077B5]" /> LinkedIn
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-kheops-gold/20 rounded transition" onClick={handleCopyLink}>
                      <BookOpen className="w-4 h-4 text-kheops-gold" /> Copier le lien
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
          {/* Bouton principal */}
          <div
            className="floating-btn floating-btn-mobile bg-gradient-to-t from-[#EB7E78] to-[#EDC070] shadow-lg animate-soft-pulse border-2 border-white"

            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Menu rapide"
          >
            <Menu className="w-5 h-5" />
          </div>
        </div>
      )}

      {/* Indicateur de progression */}
      {!isMobile && (
        <div className="reading-progress">
          {Math.round(progress)}%
        </div>
      )}

      {/* Bouton retour Kheopscope */}
      <div className="w-full pt-20 mb-8 flex justify-start pl-0 ml-0">
        <Link
          to="/kheopscope"
          className="inline-flex items-center transition-colors px-4 py-2 rounded-md shadow-sm hover:shadow-md ml-0 bg-white text-kheops-salmon hover:text-kheops-gold"
        >
          <ChevronLeft size={20} />
          <span>Retour à Kheopscope</span>
        </Link>
      </div>

      {/* Contenu principal */}
      <main className="container-custom rounded-xl shadow-xl p-8 md:p-12 lg:p-16 pt-6 md:pt-10">
        {!article ? (
          <div className="text-center text-xl text-red-500 py-24">Article introuvable.</div>
        ) : (
        <article ref={articleRef}>
          <header className="article-header">
            <div className="article-category">{article?.category}</div>
            <h1 className="article-title">{article?.title}</h1>
            <p className="article-subtitle">{article?.excerpt}</p>
            <div className="article-meta">
              <div className="meta-item">
                <User size={18} />
                <span>{article?.author}</span>
              </div>
              <div className="meta-item">
                <Calendar size={18} /> <span>{article?.publishDate}</span>
              </div>
              <div className="meta-item">
                <Clock size={18} /> <span>{article?.readTime}</span>
              </div>
              <div className="meta-item">
                <Eye size={18} /> <span>{articleStats.views.toLocaleString()} vues</span>
              </div>
              <div className="meta-item">
                <Heart size={18} className={`${isLiked ? 'text-red-500 fill-current' : ''}`} /> 
                <span>{displayLikes.toLocaleString()} j'aime</span>
              </div>
            </div>
          </header>

          {/* IMAGE PRINCIPALE */}
          {article.image && (
                    <img
                      src={article.image}
                      alt={article.title}
              className="article-image"
            />
          )}

          {/* Affichage dynamique du contenu HTML si présent */}
          {article?.content ? (
            (() => {
              if (article.slug === 'instagram-reels-vs-tiktok') {
                const dem = splitDemographic(article.content);
                if (dem) {
                  const mon = splitMonetization(dem.before);
                  const eng = splitEngagement(dem.after);
                  if (eng) {
                    const roi = splitRoi(eng.after);
                    if (roi) {
                      return (
                        <>
                          {mon ? (
                            <>
                              <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(mon.before) }} />
                              <FeatureComparison />
                              <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(mon.after) }} />
                            </>
                          ) : (
                            <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(dem.before) }} />
                          )}
                           <DemographicChart />
                          <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(eng.before) }} />
                          <EngagementChart />
                          <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(roi.before) }} />
                          <RoiPerformanceChart />
                          
                          <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(roi.after) }} />
                        </>
                      );
                    }
                    return (
                      <>
                         {mon ? (
                           <>
                             <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(mon.before) }} />
                             <FeatureComparison />
                             <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(mon.after) }} />
                           </>
                         ) : (
                           <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(dem.before) }} />
                         )}
                         <DemographicChart />
                         <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(eng.before) }} />
                         <EngagementChart />
                         <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(eng.after) }} />
                      </>
                    );
                  }
                  return (
                    <>
                       {mon ? (
                         <>
                           <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(mon.before) }} />
                           <FeatureComparison />
                           <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(mon.after) }} />
                         </>
                       ) : (
                         <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(dem.before) }} />
                       )}
                       <DemographicChart />
                       <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(dem.after) }} />
                    </>
                  );
                }
              }
              return (
                <div className="article-content" dangerouslySetInnerHTML={{ __html: addIdsToHeadings(article.content) }} />
              );
            })()
          ) : (
            <div className="article-content">
              <p>Contenu non disponible pour cet article.</p>
            </div>
          )}
        </article>
      )}
      </main>
    </div>
  );
};

export default ArticlePage;