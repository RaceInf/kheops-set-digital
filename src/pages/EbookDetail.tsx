import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import EbookAuthor from '@/components/shop/EbookAuthor';
import EbookFAQ from '@/components/shop/EbookFAQ';
import EbookTableOfContents from '@/components/shop/EbookTableOfContents';
import { PriceDisplay } from '@/components/shop/PriceDisplay';
import RelatedEbooks from '@/components/shop/RelatedEbooks';
import PaymentLogos from '@/components/ui/PaymentLogos';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useEbookStore } from '@/contexts/EbookStoreContext';
import { ebooks } from '@/data/ebooks';
import { formatDate } from '@/lib/utils';
import { Ebook } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Book, Calendar, ChevronLeft, File, FileText, Languages, PanelLeftOpen, Shield, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const EbookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const { formatPrice } = useCurrency();
  const { getPriceInfo, isOnSale } = useEbookStore();
  
  useEffect(() => {
    // Reset loading state when ID changes
    setIsLoading(true);
    
    // Simulate a small delay to ensure smooth transition
    const timer = setTimeout(() => {
      const foundEbook = ebooks.find(e => e.id === id);
      setEbook(foundEbook || null);
      setActiveTab('description');
      
      if (foundEbook) {
        document.title = `${foundEbook.title} - KHEOPS SET DIGITAL`;
      } else {
        document.title = "Ebook - KHEOPS SET DIGITAL";
      }
      
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timer);
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
  
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
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
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                      onClick={() => setIsZoomed(true)}
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
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="md:col-span-7 lg:col-span-8"
                >
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{ebook.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">{ebook.subtitle}</p>
                  
                  {/* Price Display (responsive, appears here on all devices) */}
                  <div className="mb-6">
                    <PriceDisplay 
                      isOnSale={ebook?.isOnSale} 
                      price={ebook?.price} 
                      originalPrice={ebook?.originalPrice} 
                      size="lg" 
                    />
                  </div>
                  
                  {/* Author section if available */}
                  {ebook.author && (
                    <EbookAuthor 
                      author={ebook.author} 
                      className="mb-6 hover:shadow-md transition-shadow"
                    />
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="flex items-center gap-2 text-gray-600 bg-white/80 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Calendar size={18} className="text-kheops-gold" />
                      <span>Publié le: {formatDate(ebook.publishedDate)}</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="flex items-center gap-2 text-gray-600 bg-white/80 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Book size={18} className="text-kheops-gold" />
                      <span>{ebook.pages} pages</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="flex items-center gap-2 text-gray-600 bg-white/80 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Languages size={18} className="text-kheops-gold" />
                      <span>{ebook.language}</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="flex items-center gap-2 text-gray-600 bg-white/80 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <File size={18} className="text-kheops-gold" />
                      <span>{ebook.format.join(", ")}</span>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="mt-6 space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <motion.div className="w-full" whileHover={{ scale: 1.02 }}>
                      <a 
                        href={ebook.purchaseUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block"
                      >
                        <Button 
                          className="w-full bg-kheops-gold hover:bg-kheops-gold/90 text-gray-900 py-6 text-lg shadow-md flex items-center justify-center gap-2"
                        >
                          Acheter maintenant - {isOnSale(ebook.id) ? formatPrice(getPriceInfo(ebook.id).promoPrice!) : formatPrice(ebook.price / 100)}
                        </Button>
                      </a>
                    </motion.div>
                    
                    <div className="text-center text-sm text-gray-500 mt-2">
                      <div className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span>Paiement 100% sécurisé</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400 mb-2">Vos données sont cryptées et protégées</p>
                      
                      <div className="mt-2">
                        <PaymentLogos />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Tabs Content */}
            <div className="p-6 md:p-10">
              <Tabs 
                defaultValue="description" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full justify-start mb-6 bg-gray-100 p-1 overflow-x-auto flex-nowrap">
                  <TabsTrigger 
                    value="description" 
                    className="data-[state=active]:bg-white data-[state=active]:text-kheops-gold"
                    onClick={() => setActiveTab('description')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Description
                  </TabsTrigger>
                  
                  {ebook.tableOfContents && (
                    <TabsTrigger 
                      value="contents" 
                      className="data-[state=active]:bg-white data-[state=active]:text-kheops-gold"
                      onClick={() => setActiveTab('contents')}
                    >
                      <PanelLeftOpen className="mr-2 h-4 w-4" />
                      Table des matières
                    </TabsTrigger>
                  )}
                  
                  {ebook.faq && (
                    <TabsTrigger 
                      value="faq" 
                      className="data-[state=active]:bg-white data-[state=active]:text-kheops-gold"
                      onClick={() => setActiveTab('faq')}
                    >
                      <Award className="mr-2 h-4 w-4" />
                      FAQ
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <AnimatePresence mode="wait">
                  <TabsContent key="description" value="description" className="mt-0">
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-8">
                        <div className="prose prose-gray max-w-none text-justify">
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
                  
                  {ebook.tableOfContents && (
                    <TabsContent key="contents" value="contents" className="mt-0">
                      <motion.div
                        key="contents"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <EbookTableOfContents items={ebook.tableOfContents} />
                      </motion.div>
                    </TabsContent>
                  )}
                  
                  {ebook.faq && (
                    <TabsContent key="faq" value="faq" className="mt-0">
                      <motion.div
                        key="faq"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <EbookFAQ items={ebook.faq} />
                      </motion.div>
                    </TabsContent>
                  )}
                </AnimatePresence>
              </Tabs>
            </div>
          </div>
          
          {/* Call to Action Section */}
          <div className="mt-16 bg-gradient-to-r from-kheops-gold/10 to-kheops-gold/5 p-8 rounded-xl text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Prêt à maîtriser l'art {ebook.title.includes('CM') ? 'du Community Management' : 'de la Vente'} ?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                {ebook.id === 'community-manager-de-choc' 
                  ? "Transformez-vous en Community Manager incontournable ! Maîtrisez les réseaux sociaux et démarquez-vous de la concurrence dès maintenant."
                  : "Vendez plus et plus facilement ! Découvrez les techniques secrètes des meilleurs vendeurs et boostez votre chiffre d'affaires."
                }
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.div 
                  className="w-full sm:w-auto"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a 
                    href={ebook.id === 'la-methodologie-de-la-vente' ? 'https://selar.com/j7n004' : ebook.purchaseUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full sm:w-auto"
                  >
                    <Button size="lg" className="w-full text-base font-semibold py-6 px-8 bg-kheops-gold hover:bg-kheops-gold/90 text-gray-900 shadow-md hover:shadow-lg transition-all">
                      Acheter maintenant - {formatPrice(ebook.price)}
                    </Button>
                  </a>
                </motion.div>
                {ebook.originalPrice !== undefined && ebook.originalPrice > ebook.price && (
                  <div className="text-sm text-muted-foreground line-through mt-2 sm:mt-3">
                    {formatPrice(ebook.originalPrice)}
                  </div>
                )}
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Paiement sécurisé</span>
              </div>
              <div className="mt-4">
                <PaymentLogos />
              </div>
            </div>
          </div>
          
          {/* Related ebooks section */}
          <div className="mt-16">
            <RelatedEbooks 
              currentEbookId={ebook.id}
              currentCategory={ebook.category}
              ebooks={ebooks}
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default EbookDetail;
