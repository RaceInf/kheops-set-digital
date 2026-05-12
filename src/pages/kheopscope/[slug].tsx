import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Seo from '@/components/seo/Seo';
import ArticlePage from '@/components/kheopscope/ArticlePage';
import Header from '@/components/kheopscope/Header';
import Footer from '@/components/kheopscope/Footer';
import Sidebar from '@/components/kheopscope/Sidebar';
import { blogPosts } from '@/data/blogPosts';
import ReactGA from 'react-ga4';
import { sendGA4ServerEvent } from '@/lib/ga4ServerEvent';

const ArticleSlugPage = () => {
  const { slug } = useParams();
  
  // Récupérer l'article basé sur le slug
  const article = blogPosts.find(post => post.slug === slug);
  
  // Hook pour détecter la largeur de l'écran
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1025);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Tracking GA4 pour les articles
  useEffect(() => {
    if (article) {
      // Événement de vue d'article
      ReactGA.event({
        category: 'KheopScope Article',
        action: 'Article View',
        label: article.title,
        value: 1
      });

      // Événement serveur pour un tracking plus robuste
      sendGA4ServerEvent({
        eventName: 'article_view',
        params: {
          article_id: article.id,
          article_title: article.title,
          article_category: article.category,
          article_author: article.author,
          page_location: window.location.href,
          page_referrer: document.referrer,
          engagement_time_msec: 1000,
          custom_parameter_1: 'kheopscope_article',
          custom_parameter_2: article.slug
        }
      });

      // Tracking du temps de lecture
      const startTime = Date.now();
      const handleBeforeUnload = () => {
        const readingTime = Date.now() - startTime;
        ReactGA.event({
          category: 'KheopScope Article',
          action: 'Reading Time',
          label: article.title,
          value: Math.round(readingTime / 1000) // en secondes
        });
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [article]);
  
  // Si l'article n'existe pas, on pourrait rediriger vers une page 404
  if (!article) {
    // Tracking de l'erreur 404
    ReactGA.event({
      category: 'KheopScope Error',
      action: 'Article Not Found',
      label: slug || 'unknown',
      value: 1
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <main className="container-custom py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-kheops-blue mb-4">Article non trouvé</h1>
            <p className="text-gray-600">L'article que vous recherchez n'existe pas.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <>
      <Seo 
        title={`${article.title} | Kheopscope`}
        description={article.excerpt}
        image={article.image}
        url={`https://kheopsetdigital.com/kheopscope/${article.slug}`}
        type="article"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
      <main className="container-custom py-8 sm:py-12 lg:py-16">
        {/* Desktop : sidebar à gauche, mobile : sidebar après l'article */}
        {isMobile ? (
          <div className="max-w-2xl mx-auto">
            <ArticlePage article={article} />
            <div className="my-8">
              <hr className="border-t-2 border-kheops-gold w-1/2 mx-auto mb-8" />
              <Sidebar />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <ArticlePage article={article} />
            </div>
            <div className="lg:col-span-1 order-1 lg:order-2 mt-8 lg:mt-20">
              <Sidebar />
            </div>
          </div>
        )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ArticleSlugPage;