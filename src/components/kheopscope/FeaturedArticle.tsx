import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';
import { formatDate } from '@/lib/utils';
import ReactGA from 'react-ga4';
import { sendGA4ServerEvent } from '@/lib/ga4ServerEvent';

const FeaturedArticle = () => {
  // Trouver le dernier article (par date)
  const latestArticle = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (!latestArticle) return null;

  return (
    <section className="relative py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 via-kheops-gold/5 to-kheops-salmon/5 overflow-hidden">
      {/* Éléments décoratifs de fond */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-32 sm:w-48 lg:w-72 h-32 sm:h-48 lg:h-72 bg-kheops-gold/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-32 sm:w-48 lg:w-72 h-32 sm:h-48 lg:h-72 bg-kheops-salmon/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-32 sm:w-48 lg:w-72 h-32 sm:h-48 lg:h-72 bg-kheops-blue/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-kheops-gold to-kheops-salmon text-white px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-3 lg:mb-4">
            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Article Vedette</span>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-kheops-blue mb-2 sm:mb-3 lg:mb-4 font-poppins px-2">
            <span className="bg-gradient-to-r from-kheops-gold to-kheops-salmon bg-clip-text text-transparent">Article du Moment</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto font-open-sans px-3 sm:px-4">
            Plongez dans les coulisses de la révolution numérique.
          </p>
        </motion.div>

        {/* Carte de l'article vedette */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
          className="relative"
        >
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl lg:shadow-2xl overflow-hidden border border-kheops-gold/20 hover:shadow-xl sm:hover:shadow-2xl lg:hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image avec overlay */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-kheops-gold/20 to-kheops-salmon/20 z-10"></div>
                <img
                  src={latestArticle.image}
                  alt={latestArticle.title}
                  className="w-full h-48 sm:h-64 md:h-80 lg:h-full object-cover transform hover:scale-105 sm:hover:scale-110 transition-transform duration-700"
                />
                {/* Badge de catégorie */}
                <div className="absolute top-3 sm:top-4 lg:top-6 left-3 sm:left-4 lg:left-6 z-20">
                  <span className="bg-white/90 backdrop-blur-sm text-kheops-blue px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    {latestArticle.category}
                  </span>
                </div>
                {/* Indicateur "Nouveau" */}
                <div className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 z-20">
                  <span className="bg-gradient-to-r from-kheops-salmon to-kheops-gold text-white px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-pulse">
                    NOUVEAU
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col justify-center">
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {/* Métadonnées */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{formatDate(latestArticle.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{latestArticle.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></span>
                      <span>En ligne</span>
                    </div>
                  </div>

                  {/* Titre */}
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-kheops-blue leading-tight font-poppins group-hover:text-kheops-salmon transition-colors duration-300">
                    {latestArticle.title}
                  </h3>

                  {/* Contexte descriptif */}
                  <div className="bg-gradient-to-r from-kheops-gold/10 to-kheops-salmon/10 border-l-4 border-kheops-gold p-3 sm:p-4 rounded-r-lg">
                    <p className="text-gray-700 text-xs sm:text-sm lg:text-base leading-relaxed font-open-sans italic">
                      L'objection "C'est trop cher" n'est pas la fin de la conversation. C'est le début de votre meilleure argumentation. Découvrez la méthode en 3 étapes pour ne plus jamais avoir peur de cette phrase et transformer un "peut-être" en un "oui".
                    </p>
                  </div>

                  {/* Auteur et Bouton sur la même ligne */}
                  <div className="flex flex-row items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-kheops-gold/20">
                    {/* Auteur */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-kheops-gold to-kheops-salmon rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm lg:text-base">
                        {latestArticle.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-kheops-blue text-xs sm:text-sm lg:text-base">{latestArticle.author}</p>
                        <p className="text-xs sm:text-sm text-gray-500">Expert Digital</p>
                      </div>
                    </div>

                    {/* Bouton d'action */}
                    <button 
                      onClick={() => {
                        // Tracking GA4 pour le clic sur l'article vedette
                        ReactGA.event({
                          category: 'KheopScope Featured',
                          action: 'Click Featured Article',
                          label: latestArticle.title,
                          value: 1
                        });

                        sendGA4ServerEvent({
                          eventName: 'featured_article_click',
                          params: {
                            article_id: latestArticle.id,
                            article_title: latestArticle.title,
                            article_category: latestArticle.category,
                            source: 'featured_section',
                            page_location: window.location.href,
                            custom_parameter_1: 'kheopscope_featured'
                          }
                        });

                        window.location.href = `/kheopscope/${latestArticle.slug}`;
                      }}
                      className="group inline-flex items-center px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-kheops-gold to-kheops-salmon text-white font-semibold rounded-lg sm:rounded-xl hover:from-kheops-gold/90 hover:to-kheops-salmon/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-sm lg:text-base"
                    >
                      Lire l'article complet
                      <ArrowRight className="ml-1.5 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Indicateur de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center mt-6 sm:mt-8 lg:mt-12"
        >
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 text-gray-400">
            <div className="w-4 h-6 sm:w-5 sm:h-8 lg:w-6 lg:h-10 border-2 border-kheops-gold/30 rounded-full flex justify-center">
              <div className="w-0.5 h-1.5 sm:h-2 lg:h-3 bg-kheops-salmon rounded-full mt-0.5 sm:mt-1 lg:mt-2 animate-bounce"></div>
            </div>
            <span className="text-xs sm:text-sm font-medium">Plus d'articles ci-dessous</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedArticle; 