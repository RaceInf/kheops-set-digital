import { Clock, Calendar, Eye, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getArticleStats, incrementLikes, onArticleStatsChange } from "@/lib/firebase";
import { blogPosts } from '@/data/blogPosts';


const HeroSection = () => {
  const navigate = useNavigate();
  const [articleStats, setArticleStats] = useState<{ [id: string]: { likes: number; views: number } }>({});
  const [userLikedArticles, setUserLikedArticles] = useState<string[]>([]);
  const [isLiking, setIsLiking] = useState<{[id: string]: boolean}>({});
  const [topArticles, setTopArticles] = useState<any[]>([]);

  useEffect(() => {
    const storedLikes = localStorage.getItem('kheopscopeUserLikes');
    if (storedLikes) {
      setUserLikedArticles(JSON.parse(storedLikes));
    }

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
      // Calcul du top 3
      const sorted = [...blogPosts].sort((a, b) => {
        const scoreA = (stats[a.id]?.likes || 0) + (stats[a.id]?.views || 0);
        const scoreB = (stats[b.id]?.likes || 0) + (stats[b.id]?.views || 0);
        return scoreB - scoreA;
      });
      setTopArticles(sorted.slice(0, 3));
    };
    loadStats();
    // Abonnement en temps réel
    const unsubscribes = blogPosts.map(article =>
      onArticleStatsChange(article.id, (data) => {
        setArticleStats(prev => {
          const newStats = { ...prev, [article.id]: data };
          // Recalcule le top 3 à chaque update
          const sorted = [...blogPosts].sort((a, b) => {
            const scoreA = (newStats[a.id]?.likes || 0) + (newStats[a.id]?.views || 0);
            const scoreB = (newStats[b.id]?.likes || 0) + (newStats[b.id]?.views || 0);
            return scoreB - scoreA;
          });
          setTopArticles(sorted.slice(0, 3));
          return newStats;
        });
      })
    );
    return () => { unsubscribes.forEach(unsub => unsub()); };
  }, []);

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isLiking[id] || userLikedArticles.includes(id)) {
      return;
    }

    try {
      setIsLiking(prev => ({ ...prev, [id]: true }));
      await incrementLikes(id);
      
      setArticleStats(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          likes: (prev[id]?.likes || 0) + 1
        }
      }));
      
      const newUserLikedArticles = [...userLikedArticles, id];
      setUserLikedArticles(newUserLikedArticles);
      localStorage.setItem('kheopscopeUserLikes', JSON.stringify(newUserLikedArticles));
      
    } catch (error) {
      console.error("Erreur lors de l'ajout du like :", error);
    } finally {
      setIsLiking(prev => ({ ...prev, [id]: false }));
    }
  };

  // Trouver le dernier article (par date)
  const latestArticle = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // Fonction pour naviguer vers un article
  const handleArticleClick = (articleSlug: string) => {
    navigate(`/kheopscope/${articleSlug}`);
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-kheops-blue mb-6 font-poppins"
          >
            <span className="text-gradient">Kheopscope</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-10 font-open-sans"
          >
            Votre observatoire digital pour explorer les tendances, innovations et insights du monde numérique.
          </motion.p>
        </div>

        {/* Aperçu des articles à la une */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Article principal */}
          {topArticles[0] && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-1 lg:pt-8 flex justify-center"
            >
              <div className="group cursor-pointer" onClick={() => handleArticleClick(topArticles[0].slug)}>
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg border border-kheops-gray">
                  <img
                    src={topArticles[0].image}
                    alt={topArticles[0].title}
                    className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-kheops-blue/80 to-transparent" />
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                    <Badge variant="secondary" className="mb-2 sm:mb-3 bg-kheops-gold text-kheops-blue hover:bg-kheops-salmon text-xs sm:text-sm font-medium">
                      {topArticles[0].category}
                    </Badge>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 font-poppins">
                      {topArticles[0].title}
                    </h2>
                    <p className="text-gray-200 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base font-open-sans">
                      {topArticles[0].excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-gray-300 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{topArticles[0].date || topArticles[0].publishDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{topArticles[0].readTime}</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => handleLike(topArticles[0].id, e)}
                        disabled={isLiking[topArticles[0].id] || userLikedArticles.includes(topArticles[0].id)}
                        className={`flex items-center gap-1 transition-colors ${
                          userLikedArticles.includes(topArticles[0].id) 
                            ? 'text-kheops-salmon' 
                            : 'hover:text-kheops-salmon'
                        }`}
                        title={userLikedArticles.includes(topArticles[0].id) ? "Déjà aimé" : "Aimer"}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            userLikedArticles.includes(topArticles[0].id) ? 'fill-current' : ''
                          }`} 
                        />
                        <span>{articleStats[topArticles[0].id]?.likes || 0}</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{articleStats[topArticles[0].id]?.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* Articles secondaires */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            {topArticles.slice(1).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="group cursor-pointer bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-kheops-gray"
                onClick={() => handleArticleClick(article.slug)}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="flex-shrink-0 w-full sm:w-32 h-48 sm:h-32">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 p-4 sm:p-6">
                    <Badge variant="outline" className="mb-2 border-kheops-gold text-kheops-gold text-xs font-medium">
                      {article.category}
                    </Badge>
                    <h3 className="font-bold text-kheops-blue mb-2 group-hover:text-kheops-salmon transition-colors text-sm sm:text-base line-clamp-2 font-poppins">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 font-open-sans">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-gray-500 text-xs">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{article.date || article.publishDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => handleLike(article.id, e)}
                        disabled={isLiking[article.id] || userLikedArticles.includes(article.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          userLikedArticles.includes(article.id) 
                            ? 'text-kheops-salmon' 
                            : 'hover:text-kheops-salmon'
                        }`}
                        title={userLikedArticles.includes(article.id) ? "Déjà aimé" : "Aimer"}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            userLikedArticles.includes(article.id) ? 'fill-current' : ''
                          }`} 
                        />
                        <span>{articleStats[article.id]?.likes || 0}</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{articleStats[article.id]?.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 