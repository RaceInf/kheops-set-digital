import React, { useState, useMemo, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Book, Check, ChevronDown, FileText, MessageCircle } from 'lucide-react';
import BoutiqueNavbar from '@/components/layout/BoutiqueNavbar';
import Footer from '@/components/layout/Footer';
import { ebooks } from '@/data/ebooks';
import { testimonials } from '@/data/testimonials';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/shop/SearchBar';
import FilterBar from '@/components/shop/FilterBar';
import Testimonials from '@/components/shop/Testimonials';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import ReactGA from 'react-ga4';
import Seo from '@/components/seo/Seo';

const faqs = [
  {
    question: "Comment puis-je accéder à mes e-books après l'achat ?",
    answer: "Dès que votre paiement est confirmé, vous recevrez un email avec un lien de téléchargement sécurisé. Vos e-books seront disponibles en quelques clics, prêts à être dévorés !"
  },
  {
    question: "Dans quels formats sont disponibles les e-books ?",
    answer: "Nos e-books sont disponibles en PDF et certains en format EPUB pour une lecture optimale sur tous vos appareils."
  },
  {
    question: "Les e-books sont-ils compatibles avec tous les appareils ?",
    answer: "Absolument ! Nos e-books sont au format PDF, compatible avec les smartphones, tablettes, ordinateurs et liseuses. Vous pouvez les consulter où et quand vous voulez."
  },
  {
    question: "Puis-je partager mes e-books avec d'autres personnes ?",
    answer: "Nos e-books sont destinés à un usage personnel. Si vous souhaitez les partager, nous vous invitons à encourager vos proches à se les procurer directement. Cela nous aide à continuer de créer du contenu de qualité !"
  },
  {
    question: "Comment pouvez-vous garantir la qualité de vos e-books ?",
    answer: "Nos e-books sont rédigés par des experts passionnés, relus et optimisés pour vous offrir une valeur exceptionnelle. Ils sont conçus pour être pratiques, inspirants et faciles à appliquer. La qualité, c'est notre signature."
  },
  {
    question: "Que faire si je n'arrive pas à télécharger mes e-books ?",
    answer: "Aucun souci ! Contactez-nous via WhatsApp ou par email, et nous vous enverrons rapidement une solution pour accéder à vos e-books. Votre confort est notre priorité."
  }
];

const Boutique = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  // Index of currently open FAQ in the accordion (null means all closed)
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const { formatPrice } = useCurrency();
  
  // Extraire les catégories uniques des e-books
  const categories = useMemo(() => {
    const uniqueCategories = new Set(ebooks.map(ebook => ebook.category));
    return Array.from(uniqueCategories).sort();
  }, []);
  
  const filteredAndSortedEbooks = useMemo(() => {
    // Filtrage par recherche
    let filtered = ebooks.filter(ebook => 
      ebook.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ebook => ebook.category === selectedCategory);
    }
    
    // Tri
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'date-desc':
          return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
        case 'date-asc':
          return new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
        default:
          return 0;
      }
    });
  }, [searchQuery, selectedCategory, sortBy]);

  // Effet parallaxe pour les boules
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const ball1Y = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);
  const ball2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-150%']);
  const ball3Y = useTransform(scrollYProgress, [0, 1], ['0%', '180%']);
  const ball4Y = useTransform(scrollYProgress, [0, 1], ['0%', '-120%']);
  const ball5Y = useTransform(scrollYProgress, [0, 1], ['0%', '250%']);
  const ball6Y = useTransform(scrollYProgress, [0, 1], ['0%', '-200%']);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Seo page="boutique" />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
        
        <main>
          <BoutiqueNavbar />
          
          <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="container-custom">
              <div className="text-center max-w-3xl mx-auto">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                >
                  E-books & <span className="text-gradient">Ressources</span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg md:text-xl text-gray-400 mb-10"
                >
                  Développez vos compétences avec nos guides et ressources premium pour maîtriser les stratégies digitales qui transforment votre business
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <SearchBar onSearch={setSearchQuery} />
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Boules de parallaxe (désactivées sur mobile) */}
          {!isMobile && (
            <>
              <motion.div 
                className="fixed top-[5%] left-[5%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-kheops-gold/20 rounded-full blur-[20px] md:blur-[30px] pointer-events-none"
                style={{ y: ball1Y }}
              />
              <motion.div 
                className="hidden md:block fixed top-[40%] right-[10%] w-[250px] h-[250px] bg-kheops-salmon/20 rounded-full blur-[25px] pointer-events-none"
                style={{ y: ball2Y }}
              />
              <motion.div 
                className="hidden md:block fixed top-[70%] left-[15%] w-[280px] h-[280px] bg-kheops-lightGray/20 rounded-full blur-[28px] pointer-events-none"
                style={{ y: ball3Y }}
              />
            </>
          )}

          {/* Ebooks Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-white mb-12 text-center">
                Nos <span className="text-gradient">Publications</span>
              </h2>
              
              <FilterBar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedEbooks.map((ebook) => (
                  <motion.div
                    key={ebook.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-kheops-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-kheops-gold/10"
                  >
                    <div className="relative mb-6">
                      <img 
                        src={ebook.imageUrl || '/placeholder.svg'} 
                        alt={ebook.title}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <div className="absolute top-4 left-4">
                        {ebook.id !== "vendre-avec-0f" && (
                        <Badge variant="destructive" className="bg-red-500/90 hover:bg-red-500">
                          PROMO
                        </Badge>
                        )}
                        {ebook.id === "vendre-avec-0f" && (
                          <Badge className="bg-green-600/90 text-white font-bold px-3 py-1 text-xs rounded-full shadow-md border-none animate-blink" style={{letterSpacing: '0.05em'}}>NOUVEAUTÉ</Badge>
                        )}
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="bg-kheops-gold/90 text-gray-900 hover:bg-kheops-gold">
                          PDF
                        </Badge>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{ebook.title}</h3>
                    <p className="text-gray-300 text-sm mb-2">Par {ebook.author?.name || 'KHEOPS SET DIGITAL'}</p>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {ebook.id === "vendre-avec-0f"
                        ? "Comment j’ai généré mes premières ventes sans site web, juste avec mon téléphone – et comment tu peux faire pareil."
                        : ebook.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 text-gray-400">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{ebook.pages} pages</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-kheops-gold font-bold text-lg lg:text-2xl">{formatPrice(ebook.price)}</span>
                        {ebook.isOnSale && ebook.originalPrice && (
                          <span className="text-gray-400 line-through text-sm lg:text-base">{formatPrice(ebook.originalPrice)}</span>
                        )}
                      </div>
                      {ebook.isOnSale && (
                        <Badge variant="destructive" className="hidden xl:inline-flex bg-red-500/90 hover:bg-red-500 text-xs px-2 py-0.5">
                          PROMO
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <Link 
                        to={`/boutique/${ebook.id}`}
                        className="block text-center bg-kheops-gold text-gray-900 font-medium py-3 px-6 rounded-xl hover:bg-kheops-gold/90 transition-colors"
                        onClick={() => ReactGA.event({ category: 'BoutiquePage', action: 'Click Ebook EnSavoirPlus', label: ebook.title })}
                      >
                        En savoir plus
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="border-t border-gray-800">
            <Testimonials testimonials={testimonials} />
          </section>
          
          {/* FAQ Section */}
          <section className="py-16 border-t border-gray-800">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-white mb-12 text-center">
                Questions <span className="text-gradient">Fréquentes</span>
              </h2>
              
              <div className="max-w-3xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                  <Collapsible
                    key={index}
                    open={openIndex === index}
                    onOpenChange={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden"
                  >
                    <CollapsibleTrigger className="flex items-center justify-between p-6 w-full text-left">
                      <h3 className="text-lg font-medium text-white">
                        {faq.question}
                      </h3>
                      <ChevronDown className="w-5 h-5 text-kheops-gold transition-transform ui-open:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-6 pb-6">
                      <p className="text-gray-300">{faq.answer}</p>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </section>
          
          <Footer />
        </main>
      </div>
    </>
  );
};

export default Boutique;
