import { Mail, Calendar, Eye, Heart, User, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from 'react-router-dom';
import { blogPosts, BlogPost } from '@/data/blogPosts';
import React, { useState } from 'react';
import { getArticleStats, onArticleStatsChange } from '@/lib/firebase';
import ReactGA from 'react-ga4';
import { sendGA4ServerEvent } from '@/lib/ga4ServerEvent';
import { toast } from 'sonner';

// Fonction utilitaire pour compter les occurrences
function getCategoryCounts(posts: BlogPost[]) {
  const counts: Record<string, number> = {};
  posts.forEach(post => {
    if (post.category) {
      counts[post.category] = (counts[post.category] || 0) + 1;
    }
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

function getPopularTags(posts: BlogPost[], max = 10) {
  const tagCounts: Record<string, number> = {};
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([tag]) => tag);
}

// Données auteurs (à adapter selon tes besoins)
const AUTHORS = {
  "KHEOPS SET DIGITAL": {
    name: "KHEOPS SET DIGITAL",
    avatar: "/images/team/opportun-aby.jpg", // à adapter selon ton arborescence
    bio: "Agence de communication digitale, passionnée par l'innovation et la stratégie.",
    quote: "Notre mission : transformer vos idées en succès digital !"
  },
  "Opportun Aby": {
    name: "Opportun Aby",
    avatar: "/images/team/opportun-aby.jpg",
    bio: "Expert en Stratégie et Marketing Digital.",
    quote: "L'innovation, c'est oser chaque jour."
  },
  // Ajoute d'autres auteurs ici si besoin
};

// Ajoute ce mapping après AUTHORS :
const CATEGORY_QUOTES: Record<string, string> = {
  "Intelligence Artificielle": "« L'IA n'est pas là pour remplacer l'humain, mais pour révéler son potentiel. L'avenir appartient à ceux qui savent collaborer avec la machine, sans jamais perdre leur humanité. »",
  "Marketing Digital": "Sur Facebook, la clé n'est pas la quantité, mais la qualité des connexions. Créez de la valeur, l'engagement suivra.",
  "SEO": "« Le référencement, c'est l'art de rendre visible ce qui mérite de l'être. »",
  "E-commerce": "« Un bon produit ne suffit pas, il faut une expérience client mémorable pour convertir. »",
  // Ajoute d'autres catégories/citations ici si besoin
};

// Citations spéciales pour des articles spécifiques
const SPECIAL_ARTICLE_QUOTES: Record<string, string> = {
  "tendances-marketing-digital-afrique-2025": "En Afrique, l'innovation digitale n'est pas un luxe, c'est une nécessité. L'avenir appartient à ceux qui comprennent que la technologie doit s'adapter à l'homme, et non l'inverse.",
  "instagram-reels-vs-tiktok": "La victoire n'appartiendra ni à TikTok ni à Instagram, mais aux marques qui sauront transformer les vidéos de 30 secondes en parcours d'achat sans friction.",
  // Ajoute d'autres articles spécifiques ici si besoin
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // États pour la newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false);
  
  // Catégories dynamiques
  const categories = getCategoryCounts(blogPosts);
  // Tags populaires dynamiques
  const popularTags = getPopularTags(blogPosts);

  // Fonction pour naviguer vers un article
  const handleArticleClick = (article: BlogPost) => {
    // Tracking GA4 pour le clic sur un article populaire
    ReactGA.event({
      category: 'KheopScope Sidebar',
      action: 'Click Popular Article',
      label: article.title,
      value: 1
    });

    sendGA4ServerEvent({
      eventName: 'sidebar_article_click',
      params: {
        article_id: article.id,
        article_title: article.title,
        article_category: article.category,
        source: 'popular_articles',
        page_location: window.location.href,
        custom_parameter_1: 'kheopscope_sidebar'
      }
    });

    navigate(`/kheopscope/${article.slug}`);
  };

  // Fonction pour obtenir la localisation du visiteur
  const getVisitorLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        country: data.country_name,
        countryCode: data.country_code,
        city: data.city,
        region: data.region
      };
    } catch (error) {
      console.error('Erreur lors de la détection de la localisation:', error);
      return {
        country: 'Inconnu',
        countryCode: 'XX',
        city: 'Inconnu',
        region: 'Inconnu'
      };
    }
  };

  // Fonction pour gérer l'inscription à la newsletter
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Erreur', {
        description: 'Veuillez entrer une adresse e-mail valide.',
      });
      return;
    }
    
    setIsNewsletterSubmitting(true);
    
    try {
      const locationData = await getVisitorLocation();
      const formData = {
        email: newsletterEmail,
        _subject: 'Nouvelle inscription à la newsletter - KheopScope Sidebar',
        subscriptionType: 'Newsletter',
        source: 'KheopScope Sidebar',
        page: location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || 'Direct',
        location: locationData
      };

      const response = await fetch('https://formspree.io/f/xwplbrgv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setIsNewsletterSubmitted(true);
        toast.success('Inscription réussie !', {
          description: 'Merci de vous être abonné à notre newsletter.',
        });
        setNewsletterEmail('');
        
        // Tracking GA4 pour l'inscription à la newsletter
        ReactGA.event({
          category: 'KheopScope Newsletter',
          action: 'Subscribe Newsletter',
          label: 'Sidebar',
          value: 1
        });

        sendGA4ServerEvent({
          eventName: 'newsletter_subscribe',
          params: {
            source: 'kheopscope_sidebar',
            page_location: window.location.href,
            custom_parameter_1: 'newsletter_sidebar'
          }
        });
      } else {
        throw new Error('Erreur lors de l\'inscription');
      }
    } catch (error) {
      toast.error('Erreur', {
        description: 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  // Détection de la page d'article et de la page blog
  const isArticlePage = location.pathname.startsWith('/kheopscope/') && location.pathname !== '/kheopscope';
  const isBlogPage = location.pathname === '/kheopscope';

  // Trouver l'auteur courant (article) ou principal (blog)
  let author = AUTHORS["KHEOPS SET DIGITAL"];
  let authorQuote = author.quote;
  if (isArticlePage) {
    const slug = location.pathname.split('/').pop();
    const article = blogPosts.find(a => a.slug === slug);
    if (article && AUTHORS[article.author]) {
      author = AUTHORS[article.author];
      // Utiliser la citation personnalisée de l'article si disponible
      if (article.authorQuote) {
        authorQuote = article.authorQuote;
      }
      // Sinon, citation spéciale pour l'article spécifique
      else if (article.slug && SPECIAL_ARTICLE_QUOTES[article.slug]) {
        authorQuote = SPECIAL_ARTICLE_QUOTES[article.slug];
      }
      // Sinon, citation dynamique selon la catégorie
      else if (article.category && CATEGORY_QUOTES[article.category]) {
        authorQuote = CATEGORY_QUOTES[article.category];
      } else {
        authorQuote = author.quote;
      }
    }
  }

  // Articles populaires (top 5 par vues + likes)
  const [popularArticles, setPopularArticles] = React.useState<BlogPost[]>([]);
  const [articleStats, setArticleStats] = React.useState<{ [id: string]: { likes: number; views: number } }>({});

  React.useEffect(() => {
    // Charger les stats de tous les articles
    const loadStats = async () => {
      const stats: { [id: string]: { likes: number; views: number } } = {};
      for (const article of blogPosts) {
        try {
          const data = await getArticleStats(article.id);
          stats[article.id] = {
            likes: typeof data.likes === 'number' ? data.likes : 0,
            views: typeof data.views === 'number' ? data.views : 0
          };
        } catch {
          stats[article.id] = { likes: 0, views: 0 };
        }
      }
      setArticleStats(stats);
      // Calcul du top 5
      const sorted = [...blogPosts].sort((a, b) => {
        const scoreA = (stats[a.id]?.likes || 0) + (stats[a.id]?.views || 0);
        const scoreB = (stats[b.id]?.likes || 0) + (stats[b.id]?.views || 0);
        return scoreB - scoreA;
      });
      setPopularArticles(sorted.slice(0, 5));
    };
    loadStats();
    // Abonnement en temps réel
    const unsubscribes = blogPosts.map(article =>
      onArticleStatsChange(article.id, (data) => {
        setArticleStats(prev => {
          const newStats = { ...prev, [article.id]: data };
          // Recalcule le top 5 à chaque update
          const sorted = [...blogPosts].sort((a, b) => {
            const scoreA = (newStats[a.id]?.likes || 0) + (newStats[a.id]?.views || 0);
            const scoreB = (newStats[b.id]?.likes || 0) + (newStats[b.id]?.views || 0);
            return scoreB - scoreA;
          });
          setPopularArticles(sorted.slice(0, 5));
          return newStats;
        });
      })
    );
    return () => { unsubscribes.forEach(unsub => unsub()); };
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page article : auteur en premier */}
      {isArticlePage && (
        <Card className="border border-kheops-gray">
          <CardHeader className="pb-3 sm:pb-4 flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-2">
              {author.avatar ? (
                <img src={author.avatar} alt={author.name} className="w-16 h-16 rounded-full object-cover border-2 border-kheops-gold shadow" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-kheops-gold flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              <span className="font-bold text-kheops-blue text-base font-poppins mt-2">{author.name}</span>
              <span className="text-xs text-gray-500 font-open-sans mb-1">{author.bio}</span>
              <span className="italic text-xs text-kheops-salmon font-open-sans">“{authorQuote}”</span>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Articles populaires : toujours en haut sauf si auteur présent */}
      {popularArticles.length > 0 && (
        <Card className="border border-kheops-gray">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-kheops-blue text-sm sm:text-base font-poppins">Articles populaires</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {popularArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="group cursor-pointer pb-4 hover:bg-kheops-lightGray/50 rounded-lg p-2 -m-2 transition-colors"
                  onClick={() => handleArticleClick(article)}
                >
                  <h4 className="font-medium text-kheops-blue group-hover:text-kheops-salmon transition-colors mb-2 line-clamp-2 text-sm font-poppins">
                    {article.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500 space-x-2 sm:space-x-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{article.publishDate}</span>
                    </div>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Newsletter */}
      <Card className="bg-gradient-to-br from-kheops-gold/10 to-kheops-salmon/10 border-kheops-gold">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center space-x-2 text-kheops-blue text-sm sm:text-base font-poppins">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Newsletter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isNewsletterSubmitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="text-green-600" size={24} />
              </div>
              <h3 className="text-sm font-semibold text-green-800 mb-1">Inscription réussie !</h3>
              <p className="text-xs text-green-600">Votre première newsletter arrivera bientôt.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-3 sm:mb-4 text-xs sm:text-sm font-open-sans">
                Recevez les derniers articles directement dans votre boîte mail.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2 sm:space-y-3">
                <Input
                  type="email"
                  placeholder="Votre email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white border-kheops-gray focus:border-kheops-gold text-sm font-open-sans"
                  disabled={isNewsletterSubmitting}
                />
                <Button 
                  type="submit"
                  className="w-full bg-kheops-gold hover:bg-kheops-salmon text-kheops-blue text-sm font-medium"
                  disabled={isNewsletterSubmitting}
                >
                  {isNewsletterSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'S\'abonner'
                  )}
                </Button>
              </form>
              <p className="text-xs text-gray-600 mt-2 font-open-sans">
                Pas de spam. Désabonnement en un clic.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Catégories dynamiques */}
      <Card className="border border-kheops-gray">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-kheops-blue text-sm sm:text-base font-poppins">Catégories</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1 sm:space-y-2">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-kheops-lightGray cursor-pointer transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-kheops-salmon transition-colors text-sm font-open-sans">
                  {category.name}
                </span>
                <span className="text-xs bg-kheops-lightGray text-gray-600 px-2 py-1 rounded-full group-hover:bg-kheops-gold group-hover:text-kheops-blue transition-colors font-open-sans">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags dynamiques */}
      <Card className="border border-kheops-gray">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-kheops-blue text-sm sm:text-base font-poppins">Tags populaires</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <span
                key={tag}
                className="px-2 sm:px-3 py-1 text-xs bg-kheops-lightGray text-gray-700 rounded-full hover:bg-kheops-gold hover:text-kheops-blue cursor-pointer transition-colors font-open-sans"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar; 