import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Book, Calendar, ChevronLeft, File, FileText, Languages, PanelLeftOpen, Shield, X, ShieldCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScrollToTop from '@/components/ScrollToTop';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EbookAuthor from '@/components/shop/EbookAuthor';
import EbookTableOfContents from '@/components/shop/EbookTableOfContents';
import EbookFAQ from '@/components/shop/EbookFAQ';
import RelatedEbooks from '@/components/shop/RelatedEbooks';
import { PriceDisplay } from '@/components/shop/PriceDisplay';
import PaymentLogos from '@/components/ui/PaymentLogos';
import { formatDate } from '@/lib/utils';
import { ebooks } from '@/data/ebooks';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useEbookStore } from '@/contexts/EbookStoreContext';
import ReactGA from 'react-ga4';
import { sendGA4ServerEvent } from '@/lib/ga4ServerEvent';
import Seo from '@/components/seo/Seo';

import { Ebook } from '@/types';

const EbookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const mainButtonRef = useRef<HTMLAnchorElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const { formatPrice } = useCurrency();
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const mainButton = mainButtonRef.current;

      if (mainButton) {
        const buttonPosition = mainButton.getBoundingClientRect().top;
        
        // Afficher le bouton si on est au-dessus du bouton principal, peu importe la direction du défilement
        setShowFloatingButton(buttonPosition < 0);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Reset loading state when ID changes
    setIsLoading(true);
    
    const foundEbook = ebooks.find(e => e.id === id);
    setEbook(foundEbook || null);
    setActiveTab('description');
    
    if (foundEbook) {
      document.title = `${foundEbook.title} - KHEOPS SET DIGITAL`;
    } else {
      document.title = "Ebook - KHEOPS SET DIGITAL";
    }
    
    setIsLoading(false);
    
  }, [id]);
  
  // Show loading state or not found only after loading is complete
  if (isLoading) {
    return (
      <main className="min-h-screen w-full">
        <Navbar />
        <div className="container-custom py-32">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-5 lg:col-span-4">
                <div className="aspect-[3/4] bg-gray-200 rounded-xl"></div>
              </div>
              <div className="md:col-span-7 lg:col-span-8">
                <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
                <div className="h-12 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }
  
  if (!ebook) {
    return (
      <main className="min-h-screen w-full">
        <Navbar />
        <div className="container-custom py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Ebook non trouvé</h1>
          <p className="mb-8">Désolé, l'ebook que vous recherchez n'existe pas.</p>
          <Link to="/boutique">
            <Button>Retourner à la boutique</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (ebook && ebook.id === 'vendre-avec-0f') {
      ReactGA.event({
        category: 'Ebook',
        action: 'Changement Onglet',
        label: `${ebook.title} - ${tab}`
      });
      sendGA4ServerEvent({
        eventName: 'tab_change',
        params: {
          ebook_id: ebook.id,
          ebook_title: ebook.title,
          tab,
        },
      });
    }
  };
  
  return (
    <>
      {ebook && (
        <Seo
          title={`${ebook.title} | Ebook Premium | KHEOPS SET DIGITAL`}
          description={ebook.description}
          image={ebook.imageUrl.startsWith('http') ? ebook.imageUrl : `https://kheopsetdigital.com${ebook.imageUrl}`}
          url={`https://kheopsetdigital.com/boutique/${ebook.id}`}
          type="article"
        />
      )}














      <main className="relative min-h-screen bg-gray-50">
      <ScrollToTop />
      <Navbar />
      
      {/* Floating Button */}
      <AnimatePresence>
        {showFloatingButton && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-[64px] left-0 right-0 z-50 w-full"
          >
            <div className="max-w-7xl mx-auto px-4 py-2">
              <a 
                href={ebook.id === 'methodologie-vente' || ebook.id === 'la-methodologie-de-la-vente' 
                  ? 'https://kheopsetdigital.mychariow.com/prd_766flb/checkout' 
                  : ebook.id === 'community-manager-de-choc' 
                    ? 'https://kheopsetdigital.mychariow.com/prd_t13u46/checkout' 
                    : ebook.purchaseUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="relative bg-kheops-salmon hover:bg-kheops-salmon/90 text-white w-full py-3 px-4 text-sm md:text-base lg:text-lg font-semibold overflow-hidden group shadow-lg rounded-md flex items-center justify-center"
                onClick={async (e) => {
                  e.preventDefault();
                  const url = e.currentTarget.href;
                  
                  // Envoyer les événements d'analyse
                  ReactGA.event({
                    category: 'Ebook',
                    action: 'Achat Ebook (flottant)',
                    label: ebook.title,
                    value: ebook.price
                  });
                  
                  // Envoyer les événements d'analyse de manière asynchrone
                  sendGA4ServerEvent({
                    eventName: 'purchase',
                    params: {
                      ebook_id: ebook.id,
                      ebook_title: ebook.title,
                      value: ebook.price,
                      currency: 'XAF',
                    },
                  }).catch(console.error);
                  
                  // Ouvrir directement dans un nouvel onglet
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Acheter maintenant
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="font-bold">{formatPrice(ebook.price)}</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-kheops-salmon via-kheops-gold to-kheops-salmon opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="pt-32 pb-16">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Link to="/boutique" className="inline-flex items-center text-kheops-salmon hover:text-kheops-gold transition-colors bg-white px-4 py-2 rounded-md shadow-sm hover:shadow-md">
              <ChevronLeft size={20} />
              <span>Retour à la boutique</span>
            </Link>
          </motion.div>
          
          <div className="relative bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header Card */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-kheops-gold/10 to-kheops-salmon/10 p-6 md:p-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Image Column */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="md:col-span-5 lg:col-span-4"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 group">
                    <motion.div 
                      className="w-full h-full cursor-zoom-in"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      onClick={() => {
                        setIsZoomed(true);
                        if (ebook && ebook.id === 'vendre-avec-0f') {
                          ReactGA.event({
                            category: 'Ebook',
                            action: 'Zoom Image',
                            label: ebook.title
                          });
                          sendGA4ServerEvent({
                            eventName: 'zoom_image',
                            params: {
                              ebook_id: ebook.id,
                              ebook_title: ebook.title,
                            },
                          });
                        }
                      }}
                    >
                      <img 
                        src={ebook.imageUrl}
                        alt={ebook.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:shadow-lg"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white text-sm font-medium">Cliquez pour zoomer</span>
                      </div>
                      
                      {ebook.isOnSale && (
                        <div className="absolute top-4 right-4 bg-kheops-salmon text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          PROMO
                        </div>
                      )}
                    </motion.div>

                    {/* Overlay zoom */}
                    <AnimatePresence>
                      {isZoomed && (
                        <motion.div 
                          className="fixed inset-0 z-50 flex items-center justify-center p-4"
                          initial={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0,0,0,0)' }}
                          animate={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.9)' }}
                          exit={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0,0,0,0)' }}
                          onClick={() => setIsZoomed(false)}
                        >
                          <motion.div 
                            className="relative max-w-[90vw] max-h-[90vh]"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 30 }}
                          >
                            <img 
                              src={ebook.imageUrl} 
                              alt={ebook.title}
                              className="rounded-lg shadow-2xl object-contain max-h-[80vh]"
                            />
                            
                            <button 
                              className="absolute -top-12 right-0 p-2 text-white hover:text-kheops-gold transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsZoomed(false);
                              }}
                            >
                              <X className="w-8 h-8" />
                              <span className="sr-only">Fermer</span>
                            </button>
                            
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                              Cliquez n'importe où pour fermer
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
                
                {/* Details Column */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="md:col-span-7 lg:col-span-8"
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{ebook.title}</h1>
                      <p className="text-base md:text-lg text-gray-600 mb-4 line-clamp-2">{ebook.subtitle}</p>
                      
                      <div className="mb-4" ref={priceRef}>
                        <PriceDisplay
                          price={ebook.price}
                          originalPrice={ebook.originalPrice}
                          isOnSale={ebook.isOnSale}
                          className="text-2xl"
                        />
                      </div>

                      {ebook.author && <EbookAuthor author={ebook.author} />}

                      {/* New grid for publication details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <Calendar className="w-5 h-5 text-kheops-gold" />
                          <span className="text-gray-700">Publié le: {formatDate(ebook.publishedDate, 'DD/MM/YY')}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <Book className="w-5 h-5 text-kheops-gold" />
                          <span className="text-gray-700">{ebook.pages} pages</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <Languages className="w-5 h-5 text-kheops-gold" />
                          <span className="text-gray-700">{ebook.language}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <File className="w-5 h-5 text-kheops-gold" />
                          <span className="text-gray-700">{ebook.format}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex flex-col gap-4">
                        <a 
                          ref={mainButtonRef}
                          href={ebook.id === 'methodologie-vente' || ebook.id === 'la-methodologie-de-la-vente' 
                            ? 'https://kheopsetdigital.mychariow.com/prd_766flb/checkout' 
                            : ebook.id === 'community-manager-de-choc' 
                              ? 'https://kheopsetdigital.mychariow.com/prd_t13u46/checkout' 
                              : ebook.purchaseUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative bg-kheops-salmon hover:bg-kheops-salmon/90 text-white w-full py-3 px-4 text-sm md:text-base lg:text-lg font-semibold overflow-hidden group shadow-lg rounded-md flex items-center justify-center"
                          onClick={async (e) => {
                            e.preventDefault();
                            const url = e.currentTarget.href;
                            
                            // Envoyer les événements d'analyse
                            ReactGA.event({
                              category: 'Ebook',
                              action: 'Achat Ebook',
                              label: ebook.title,
                              value: ebook.price
                            });
                            
                            // Envoyer les événements d'analyse de manière asynchrone
                            sendGA4ServerEvent({
                              eventName: 'purchase',
                              params: {
                                ebook_id: ebook.id,
                                ebook_title: ebook.title,
                                value: ebook.price,
                                currency: 'XAF',
                              },
                            }).catch(console.error);
                            
                            // Ouvrir directement dans un nouvel onglet
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Acheter maintenant
                            <svg 
                              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <span className="font-bold">{formatPrice(ebook.price)}</span>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-kheops-salmon via-kheops-gold to-kheops-salmon opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </a>

                        <div className="text-center text-gray-500 text-sm">
                          <p className="flex items-center justify-center gap-2 mb-1">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span className="font-bold">Paiement 100% sécurisé</span>
                          </p>
                          <p>Vos données sont cryptées et protégées</p>
                        </div>

                        <PaymentLogos />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Tabs Section */}
            <div className="p-6 md:p-10">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  {ebook.tableOfContents && ebook.tableOfContents.length > 0 && (
                    <TabsTrigger value="contents">Sommaire</TabsTrigger>
                  )}
                  {ebook.faq && ebook.faq.length > 0 && (
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                  )}
                </TabsList>
                
                <AnimatePresence mode="wait">
                  <TabsContent key="description" value="description" className="mt-6">
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                    >
                      <div className="mb-8">
                        <div className="prose prose-gray max-w-none text-left">
                          {ebook.fullDescription.split('\n\n').map((paragraph, index) => (
                            <motion.p 
                              key={index} 
                              className="mb-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              {paragraph}
                            </motion.p>
                          ))}
                        </div>
                      </div>
                      
                      <motion.div 
                        className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        <h2 className="text-xl font-bold mb-4">Ce que vous allez apprendre</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {ebook.features.map((feature, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-start gap-2 bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                              whileHover={{ scale: 1.01, x: 3 }}
                            >
                              <div className="text-kheops-gold mt-1 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                              <span>{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
                
                {ebook.tableOfContents && ebook.tableOfContents.length > 0 && (
                  <TabsContent value="contents" className="mt-6">
                    <EbookTableOfContents items={ebook.tableOfContents} />
                  </TabsContent>
                )}
                
                {ebook.faq && ebook.faq.length > 0 && (
                  <TabsContent value="faq" className="mt-6">
                    <EbookFAQ items={ebook.faq} />
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
          
          {/* Related ebooks */}
          <div className="mt-16">
            <RelatedEbooks currentEbookId={ebook.id} ebooks={ebooks} />
          </div>
        </div>
      </section>
      
      <Footer />
      </main>
    </>
  );
};

export default EbookDetailPage;