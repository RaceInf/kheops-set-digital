import React, { useEffect } from 'react';
import Seo from "@/components/seo/Seo";
import Header from "@/components/kheopscope/Header";
import HeroSection from "@/components/kheopscope/HeroSection";
import FeaturedArticle from "@/components/kheopscope/FeaturedArticle";
import ArticleGrid from "@/components/kheopscope/ArticleGrid";
import Sidebar from "@/components/kheopscope/Sidebar";
import Footer from "@/components/kheopscope/Footer";
import ReactGA from 'react-ga4';
import { sendGA4ServerEvent } from '@/lib/ga4ServerEvent';

const Kheopscope = () => {
  useEffect(() => {
    // Tracking GA4 pour la page KheopScope
    ReactGA.event({
      category: 'KheopScope',
      action: 'Page View',
      label: 'KheopScope Main Page',
      value: 1
    });

    // Événement serveur pour un tracking plus robuste
    sendGA4ServerEvent({
      eventName: 'page_view',
      params: {
        page_title: 'KheopScope - Blog Digital',
        page_location: window.location.href,
        page_referrer: document.referrer,
        engagement_time_msec: 1000,
        custom_parameter_1: 'kheopscope_main'
      }
    });

    // Tracking du temps d'engagement
    const startTime = Date.now();
    const handleBeforeUnload = () => {
      const engagementTime = Date.now() - startTime;
      ReactGA.event({
        category: 'KheopScope',
        action: 'Engagement Time',
        label: 'KheopScope Main Page',
        value: Math.round(engagementTime / 1000) // en secondes
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <>
      <Seo page="kheopscope" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <HeroSection />
        <FeaturedArticle />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <ArticleGrid />
          </div>
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
      
        <Footer />
      </div>
    </>
  );
};

export default Kheopscope; 