import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Index from './pages/Index';
import Services from './pages/Services';
import ServiceDetailPage from './pages/ServiceDetailPage';
import Boutique from './pages/Boutique';
import Apropos from './pages/Apropos';
import EbookDetailPage from './pages/EbookDetailPage';
import PricingFormPage from './pages/PricingFormPage';
import LegalNotice from './pages/LegalNotice';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfSale from './pages/TermsOfSale';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Kheopscope from './pages/KheopScope';
import { Toaster } from '@/components/ui/sonner';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { EbookStoreProvider } from '@/contexts/EbookStoreContext';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollProgress from '@/components/ScrollProgress';
import { MotionConfig } from 'framer-motion';
import ReactGA from 'react-ga4';
import UserNoticeBanner from './components/UserNoticeBanner';
import ArticleDetail from './pages/kheopscope/[slug]';

const GA_MEASUREMENT_ID = 'G-N0Z2W2LHSZ';

function Ga4Listener() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);
  return null;
}

function App() {
  useEffect(() => {
    // Déclencheur pour le prerendering
    document.dispatchEvent(new Event('prerender-trigger'));

    const startColor = { r: 237, g: 192, b: 112 };
    const endColor = { r: 235, g: 126, b: 120 };
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.pageYOffset || doc.scrollTop;
      const scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      const t = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      // interpolate RGB
      const r = Math.round(startColor.r + (endColor.r - startColor.r) * t);
      const g = Math.round(startColor.g + (endColor.g - startColor.g) * t);
      const b = Math.round(startColor.b + (endColor.b - startColor.b) * t);
      const thumbColor = `rgb(${r}, ${g}, ${b})`;
      const hoverColor = `rgb(${endColor.r}, ${endColor.g}, ${endColor.b})`;
      doc.style.setProperty('--scroll-thumb', thumbColor);
      doc.style.setProperty('--scroll-thumb-hover', hoverColor);
      const scrolled = t * 100;
      doc.style.setProperty('--scroll-progress', `${scrolled}%`);
      doc.style.setProperty('--scroll-hue', `${scrolled * 3.6}`);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <MotionConfig reducedMotion={isMobile ? 'always' : 'user'}>
      <CurrencyProvider>
      <EbookStoreProvider>
        <HelmetProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Ga4Listener />
            <ScrollToTop />
            <ScrollProgress />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
              <Route path="/boutique" element={<Boutique />} />
              <Route path="/boutique/:id" element={<EbookDetailPage />} />
              <Route path="/apropos" element={<Apropos />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/services/formulaire-de-souscription" element={<PricingFormPage />} />
              <Route path="/mentions-legales" element={<LegalNotice />} />
              <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
              <Route path="/conditions-generales-de-vente" element={<TermsOfSale />} />
              <Route path="/kheopscope" element={<Kheopscope />} />
              <Route path="/kheopscope/:slug" element={<ArticleDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="bottom-center" />
            <UserNoticeBanner />
          </Router>
        </HelmetProvider>
      </EbookStoreProvider>
    </CurrencyProvider>
    </MotionConfig>
  );
}

export default App;