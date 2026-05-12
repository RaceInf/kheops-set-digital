import { useState, useEffect } from "react";
import { Clock, Calendar, Eye, Heart, Search, Filter, Grid3X3, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { onArticleStatsChange, incrementLikes } from "@/lib/firebase";
import LikeButton from '@/components/LikeButton';
import { useNavigate } from 'react-router-dom';
import { blogPosts } from '@/data/blogPosts';
import { formatDate } from '@/lib/utils';
import ReactGA from 'react-ga4';
import { sendGA4ServerEvent } from '@/lib/ga4ServerEvent';

function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

const ArticleGrid = () => {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [articleStats, setArticleStats] = useState<{ [id: string]: { likes: number; views: number } }>({});
  const [userLikedArticles, setUserLikedArticles] = useState<string[]>([]);
  const [isLiking, setIsLiking] = useState<{[id: string]: boolean}>({});

  const categories = ["Tous", "Développement", "Design", "IA", "Marketing", "Business"];

  const articles = blogPosts;

  const navigate = useNavigate();

  useEffect(() => {
    // Charger les articles déjà likés par l'utilisateur
    const loadUserLikes = () => {
      try {
        const storedUserLikes = localStorage.getItem('kheopscopeUserLikes');
        if (storedUserLikes) {
          setUserLikedArticles(JSON.parse(storedUserLikes));
        } else {
          setUserLikedArticles([]);
        }
      } catch (e) {
        setUserLikedArticles([]);
      }
    };
    loadUserLikes();

    // Écouteur pour les changements de localStorage (autres onglets/pages)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'kheopscopeUserLikes') {
        loadUserLikes();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    // Écouter en temps réel les statistiques pour chaque article
    const unsubscribes = articles.map((art) =>
      onArticleStatsChange(art.id, (newStats) => {
        setArticleStats(prev => ({
          ...prev,
          [art.id]: { likes: newStats.likes, views: newStats.views }
        }));
      })
    );

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [articles]);

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('handleLike appelé pour l\'article ID:', id);
    
    // Si déjà en train de liker ou déjà liké, on ne fait rien
    if (isLiking[id] || userLikedArticles.includes(id)) {
      console.log('Article déjà liké ou en cours de like');
      return;
    }

    try {
      setIsLiking(prev => ({ ...prev, [id]: true }));
      console.log('Tentative d\'incrémentation du like...');
      
      await incrementLikes(id);
      
      // Tracking GA4 pour le like
      const article = articles.find(a => a.id === id);
      if (article) {
        ReactGA.event({
          category: 'KheopScope Article',
          action: 'Like Article',
          label: article.title,
          value: 1
        });

        sendGA4ServerEvent({
          eventName: 'article_like',
          params: {
            article_id: id,
            article_title: article.title,
            article_category: article.category,
            page_location: window.location.href,
            custom_parameter_1: 'kheopscope_grid'
          }
        });
      }
      
      // Mise à jour optimiste de l'UI
      setArticleStats(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          likes: (prev[id]?.likes || 0) + 1
        }
      }));
      
      // Mettre à jour l'état local
      const newUserLikedArticles = [...userLikedArticles, id];
      setUserLikedArticles(newUserLikedArticles);
      localStorage.setItem('kheopscopeUserLikes', JSON.stringify(newUserLikedArticles));
      
    } catch (error) {
      console.error("Erreur lors de l'ajout du like :", error);
      alert(error instanceof Error ? error.message : "Une erreur s'est produite");
    } finally {
      setIsLiking(prev => ({ ...prev, [id]: false }));
    }
  };

  // Filtrage des articles
  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeFilter === "Tous" || article.category === activeFilter;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Tri des articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === "readTime") {
      return parseInt(a.readTime) - parseInt(b.readTime);
    }
    if (sortBy === "trending") {
      const likesA = articleStats[a.id]?.likes || 0;
      const likesB = articleStats[b.id]?.likes || 0;
      return likesB - likesA;
    }
    if (sortBy === "popular") {
      const viewsA = articleStats[a.id]?.views || 0;
      const viewsB = articleStats[b.id]?.views || 0;
      return viewsB - viewsA;
    }
    if (sortBy === "engagement") {
      const engagementA = (articleStats[a.id]?.likes || 0) + (articleStats[a.id]?.views || 0);
      const engagementB = (articleStats[b.id]?.likes || 0) + (articleStats[b.id]?.views || 0);
      return engagementB - engagementA;
    }
    return 0;
  });

  // Abonnement en temps réel aux changements de Firestore
  useEffect(() => {
    const unsubscribes = articles.map(article =>
      onArticleStatsChange(article.id, (data) => {
        setArticleStats(prev => ({
          ...prev,
          [article.id]: {
            likes: typeof data.likes === 'number' ? data.likes : 0,
            views: typeof data.views === 'number' ? data.views : 0
          }
        }));
      })
    );

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Barre de navigation et filtres */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-kheops-gray">
        {/* Première rangée : Recherche et Contrôles */}
        <div className="p-3 sm:p-6 border-b border-kheops-gray">
          <div className="flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:gap-4 lg:items-center lg:justify-between">
            {/* Recherche */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => {
                  const newQuery = e.target.value;
                  setSearchQuery(newQuery);
                  
                  // Tracking GA4 pour la recherche
                  if (newQuery.length > 2) {
                    ReactGA.event({
                      category: 'KheopScope Search',
                      action: 'Search Query',
                      label: newQuery,
                      value: newQuery.length
                    });
                  }
                }}
                className="pl-10 bg-kheops-lightGray border-kheops-gray focus:bg-white focus:border-kheops-gold transition-colors h-10 font-open-sans"
              />
            </div>

            {/* Contrôles - Desktop et Tablette uniquement */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Mode d'affichage */}
              <div className="flex items-center bg-kheops-lightGray rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setViewMode("grid");
                    // Tracking GA4 pour le changement de mode d'affichage
                    ReactGA.event({
                      category: 'KheopScope UI',
                      action: 'Change View Mode',
                      label: 'Grid View',
                      value: 1
                    });
                  }}
                  className={`h-8 px-2 ${viewMode === "grid" ? "bg-kheops-gold text-kheops-blue shadow-sm" : "text-gray-600"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setViewMode("list");
                    // Tracking GA4 pour le changement de mode d'affichage
                    ReactGA.event({
                      category: 'KheopScope UI',
                      action: 'Change View Mode',
                      label: 'List View',
                      value: 1
                    });
                  }}
                  className={`h-8 px-2 ${viewMode === "list" ? "bg-kheops-gold text-kheops-blue shadow-sm" : "text-gray-600"}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Tri */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <Select value={sortBy} onValueChange={(value) => {
                  setSortBy(value);
                  
                  // Tracking GA4 pour le tri
                  ReactGA.event({
                    category: 'KheopScope Filter',
                    action: 'Sort Articles',
                    label: value,
                    value: 1
                  });

                  sendGA4ServerEvent({
                    eventName: 'article_sort',
                    params: {
                      sort_method: value,
                      page_location: window.location.href,
                      custom_parameter_1: 'kheopscope_grid'
                    }
                  });
                }}>
                  <SelectTrigger className="w-40 bg-kheops-lightGray border-kheops-gray focus:bg-white focus:border-kheops-gold h-10 font-open-sans">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Plus récents</SelectItem>
                    <SelectItem value="trending">Plus aimés</SelectItem>
                    <SelectItem value="popular">Plus vus</SelectItem>
                    <SelectItem value="oldest">Plus anciens</SelectItem>
                    <SelectItem value="readTime">Temps de lecture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tri - Mobile uniquement */}
            <div className="flex sm:hidden items-center gap-2 w-full">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value);
                
                // Tracking GA4 pour le tri (mobile)
                ReactGA.event({
                  category: 'KheopScope Filter',
                  action: 'Sort Articles Mobile',
                  label: value,
                  value: 1
                });
              }}>
                <SelectTrigger className="w-full bg-kheops-lightGray border-kheops-gray focus:bg-white focus:border-kheops-gold h-10 font-open-sans">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus récents</SelectItem>
                  <SelectItem value="trending">Plus aimés</SelectItem>
                  <SelectItem value="popular">Plus vus</SelectItem>
                  <SelectItem value="oldest">Plus anciens</SelectItem>
                  <SelectItem value="readTime">Temps de lecture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Deuxième rangée : Filtres par catégorie */}
        {/* SUPPRIMÉ : toute la section de filtre par catégorie */}
      </div>

      {/* Grille d'articles - Mode Grille */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {sortedArticles.map((article) => (
            <div key={article.id} onClick={() => {
              // Tracking GA4 pour le clic sur un article
              ReactGA.event({
                category: 'KheopScope Article',
                action: 'Click Article',
                label: article.title,
                value: 1
              });

              sendGA4ServerEvent({
                eventName: 'article_click',
                params: {
                  article_id: article.id,
                  article_title: article.title,
                  article_category: article.category,
                  view_mode: 'grid',
                  page_location: window.location.href,
                  custom_parameter_1: 'kheopscope_grid'
                }
              });

              navigate(`/kheopscope/${article.slug}`);
            }} className="cursor-pointer">
              <article
                key={article.id}
                className="group cursor-pointer bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-kheops-gray"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <Badge variant="secondary" className="bg-kheops-gold text-kheops-blue hover:bg-kheops-salmon text-xs font-medium">
                      {article.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-kheops-blue mb-2 group-hover:text-kheops-salmon transition-colors line-clamp-2 text-sm sm:text-base font-poppins">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-open-sans flex-grow">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto pt-4 flex items-center text-gray-500 text-xs font-open-sans border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDateShort(article.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <LikeButton articleId={article.id} initialCount={articleStats[article.id]?.likes || 0} className="p-0 bg-transparent" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{articleStats[article.id]?.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}

      {/* Liste d'articles - Mode Liste */}
      {viewMode === "list" && (
        <div className="space-y-4 sm:space-y-6">
          {sortedArticles.map((article) => (
            <div key={article.id} onClick={() => {
              // Tracking GA4 pour le clic sur un article
              ReactGA.event({
                category: 'KheopScope Article',
                action: 'Click Article',
                label: article.title,
                value: 1
              });

              sendGA4ServerEvent({
                eventName: 'article_click',
                params: {
                  article_id: article.id,
                  article_title: article.title,
                  article_category: article.category,
                  view_mode: 'list',
                  page_location: window.location.href,
                  custom_parameter_1: 'kheopscope_grid'
                }
              });

              navigate(`/kheopscope/${article.slug}`);
            }} className="cursor-pointer">
              <article
                key={article.id}
                className="group cursor-pointer bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-kheops-gray"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="flex-shrink-0 w-full sm:w-48 h-48 sm:h-32">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="bg-kheops-gold text-kheops-blue text-xs mb-2 font-medium">
                        {article.category}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-kheops-blue mb-2 group-hover:text-kheops-salmon transition-colors text-lg font-poppins">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-open-sans">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center text-gray-500 text-xs">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDateShort(article.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <LikeButton articleId={article.id} initialCount={articleStats[article.id]?.likes || 0} className="p-0 bg-transparent" />
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{articleStats[article.id]?.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}

      {/* Message si aucun résultat */}
      {sortedArticles.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-kheops-blue mb-2 font-poppins">Aucun article trouvé</h3>
          <p className="text-gray-600 text-sm sm:text-base font-open-sans">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
};

export default ArticleGrid;