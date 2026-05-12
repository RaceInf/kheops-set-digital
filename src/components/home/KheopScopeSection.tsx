import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, BookOpen, Binoculars } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { sendGA4ServerEvent } from '@/lib/ga4ServerEvent';
import './KheopScopeAnimations.css';

const KheopScopeSection = () => {
  // Récupérer les 2 articles les plus récents
  const latestArticles = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  const handleArticleClick = (article: typeof blogPosts[0]) => {
    // Tracking GA4 pour le clic sur un article depuis la page d'accueil
    ReactGA.event({
      category: 'Homepage KheopScope',
      action: 'Click Article',
      label: article.title,
      value: 1
    });

    sendGA4ServerEvent({
      eventName: 'homepage_article_click',
      params: {
        article_id: article.id,
        article_title: article.title,
        article_category: article.category,
        source: 'homepage_kheopscope',
        page_location: window.location.href,
        custom_parameter_1: 'homepage_section'
      }
    });
  };

  if (latestArticles.length === 0) return null;

  return (
    <section className="section-padding bg-white relative overflow-hidden" id="kheopscope">
      {/* Boules digitales animées */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        {/* Boules qui tombent */}
        <div className="floating-ball top-0 left-1/4 w-0.5 h-0.5 bg-kheops-gold/30 ball-fall-1"></div>
        <div className="floating-ball top-0 left-1/3 w-1.5 h-1.5 bg-kheops-salmon/40 ball-fall-2"></div>
        <div className="floating-ball top-0 left-1/2 w-1 h-1 bg-kheops-gold/20 ball-fall-3"></div>
        <div className="floating-ball top-0 right-1/3 w-1 h-1 bg-kheops-salmon/35 ball-fall-4"></div>
        <div className="floating-ball top-0 right-1/4 w-0.5 h-0.5 bg-kheops-gold/50 ball-fall-5"></div>
        
        {/* Boules qui circulent horizontalement */}
        <div className="floating-ball top-1/4 left-0 w-0.5 h-0.5 bg-kheops-salmon/30 ball-float-h-1"></div>
        <div className="floating-ball top-1/3 right-0 w-1.5 h-1.5 bg-kheops-gold/40 ball-float-h-2"></div>
        <div className="floating-ball top-2/3 left-0 w-1 h-1 bg-kheops-salmon/25 ball-float-h-3"></div>
        <div className="floating-ball top-3/4 right-0 w-0.5 h-0.5 bg-kheops-gold/35 ball-float-h-4"></div>
        
        {/* Boules qui flottent verticalement */}
        <div className="floating-ball bottom-0 left-1/6 w-0.5 h-0.5 bg-kheops-salmon/60 ball-float-v-1"></div>
        <div className="floating-ball bottom-0 right-1/5 w-1.5 h-1.5 bg-kheops-gold/45 ball-float-v-2"></div>
        <div className="floating-ball bottom-0 left-1/5 w-0.5 h-0.5 bg-kheops-salmon/55 ball-float-v-3"></div>
        <div className="floating-ball bottom-0 right-1/6 w-0.5 h-0.5 bg-kheops-gold/30 ball-float-v-4"></div>
        
        {/* Boules en orbite */}
        <div className="floating-ball top-1/4 left-1/4 w-1 h-1 bg-kheops-salmon/40 ball-orbit-1"></div>
        <div className="floating-ball top-3/4 right-1/4 w-0.5 h-0.5 bg-kheops-gold/35 ball-orbit-2"></div>
        
        {/* Boules en zigzag */}
        <div className="floating-ball top-1/2 left-1/3 w-0.5 h-0.5 bg-kheops-salmon/50 ball-zigzag-1"></div>
        <div className="floating-ball top-1/3 right-1/3 w-1 h-1 bg-kheops-gold/40 ball-zigzag-2"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-kheops-gold to-kheops-salmon text-white px-4 py-2 rounded-full text-sm font-medium mb-6 -mt-8">
            <Binoculars className="w-4 h-4" />
            <span>KheopScope</span>
          </div>
          <h2 className="mb-4">Les <span className="bg-gradient-to-r from-kheops-gold to-kheops-salmon bg-clip-text text-transparent">Derniers Articles</span></h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Découvrez nos dernières analyses et insights sur le marketing digital, l'IA et les tendances technologiques.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {latestArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer bg-white rounded-lg lg:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-kheops-gold/20"
            >
              <Link 
                to={`/kheopscope/${article.slug}`}
                onClick={() => handleArticleClick(article)}
                className="block"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-40 sm:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Badge de catégorie */}
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-black px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {article.category}
                    </span>
                  </div>
                  
                  {/* Badge "Nouveau" pour le plus récent */}
                  {index === 0 && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <span className="bg-gradient-to-r from-kheops-salmon to-kheops-gold text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        NOUVEAU
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-4 sm:p-6">
                  {/* Métadonnées */}
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{formatDate(article.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Titre */}
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-2 sm:mb-3 group-hover:text-kheops-salmon transition-colors duration-300 font-poppins">
                    {article.title}
                  </h3>

                  {/* Extrait */}
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2 font-open-sans">
                    {article.excerpt}
                  </p>

                  {/* Auteur et bouton */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-kheops-gold to-kheops-salmon rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                        {article.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-black">{article.author}</span>
                    </div>
                    
                    <div className="flex items-center text-kheops-salmon group-hover:text-kheops-gold transition-colors duration-300">
                      <span className="text-xs sm:text-sm font-medium mr-1 sm:mr-2">Lire plus</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Bouton "Voir tous les articles" */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            to="/kheopscope"
            onClick={() => {
              ReactGA.event({
                category: 'Homepage KheopScope',
                action: 'Click View All Articles',
                label: 'View All Articles Button',
                value: 1
              });
            }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-kheops-gold to-kheops-salmon text-white font-semibold rounded-full hover:from-kheops-gold/90 hover:to-kheops-salmon/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <BookOpen className="mr-2 w-5 h-5" />
            Voir tous les articles
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default KheopScopeSection; 