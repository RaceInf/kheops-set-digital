import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Index from './pages/Index';
import Services from './pages/Services';
import ServiceDetailPage from './pages/ServiceDetailPage';
import Boutique from './pages/Boutique';
import Apropos from './pages/Apropos';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import EbookDetail from './pages/EbookDetail';
import PricingFormPage from './pages/PricingFormPage';
import LegalNotice from './pages/LegalNotice';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/sonner';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { EbookStoreProvider } from '@/contexts/EbookStoreContext';
import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-N0Z2W2LHSZ';

function Ga4Listener() {
  const location = useLocation();
  React.useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);
  return null;
}

function App() {
  React.useEffect(() => {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  }, []);

  return (
    <CurrencyProvider>
      <EbookStoreProvider>
        <Router>
          <Ga4Listener />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/ebook/:id" element={<EbookDetail />} />
            <Route path="/apropos" element={<Apropos />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/pricing-form" element={<PricingFormPage />} />
            <Route path="/mentions-legales" element={<LegalNotice />} />
            <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="bottom-center" />
        </Router>
      </EbookStoreProvider>
    </CurrencyProvider>
  );
}

export default App;
