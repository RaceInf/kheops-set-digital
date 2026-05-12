import { Link } from 'react-router-dom';
import { ArrowRight, Book, Clock, FileText, Star, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ebooks } from '@/data/ebooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PriceDisplay } from '@/components/shop/PriceDisplay';
import { useCurrency } from '@/contexts/CurrencyContext';
import ReactGA from 'react-ga4';

const ShopSection = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const { formatPrice } = useCurrency();
  
  // Trier les ebooks par date de publication décroissante et ne garder que les deux plus récents
  const displayedEbooks = [...ebooks]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, 2);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section id="boutique" className="relative py-20 overflow-hidden">
      {/* Fond dynamique avec effet Parallax */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        {!isMobile && (<>

        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>
        {/* Étoiles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>
        {/* Effet de lueur */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-kheops-gold/5 to-transparent"></div>
      </>
        )}
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-12 gap-8 items-center mb-16">
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kheops-gold/80 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-kheops-gold"></span>
              </span>
              <span className="text-sm font-medium text-kheops-gold tracking-wider">
                NOS FORMATIONS
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-kheops-gold to-kheops-salmon bg-clip-text text-transparent">
                E-books
              </span> Premium
            </h2>
            
            <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
              Une sélection exclusive pour booster vos compétences digitales et transformer votre carrière.
            </p>
          </motion.div>

          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-kheops-gold to-kheops-salmon rounded-2xl blur opacity-20"></div>
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-kheops-gold to-kheops-salmon flex items-center justify-center">
                    <Book className="w-5 h-5 text-white" />
                  </div>
                  <div className="-space-y-4">
                    <h3 className="text-lg font-semibold text-white">Formations Premium</h3>
                    <p className="text-gray-400 text-sm">Contenu exclusif et professionnel</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {['Contenu mis à jour régulièrement', 'Support prioritaire', 'Accès à vie', 'Format PDF optimisé'].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-300 text-sm">
                      <div className="w-4 h-4 rounded-full bg-kheops-gold/20 flex items-center justify-center">
                        <ChevronRight className="w-3 h-3 text-kheops-gold" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {displayedEbooks.map((ebook, index) => (
            <motion.div
              key={ebook.id}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-kheops-gold to-kheops-salmon rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={ebook.imageUrl} 
                    alt={ebook.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                  {ebook.id === "vendre-avec-0f" && (
                    <Badge className="bg-green-600/90 text-white font-bold px-3 py-1 text-xs rounded-full shadow-md border-none animate-blink" style={{letterSpacing: '0.05em', top: '1rem', left: '1rem', position: 'absolute', zIndex: 10}}>NOUVEAUTÉ</Badge>
                  )}
                  {ebook.isOnSale && (
                    <motion.div 
                      className="absolute top-4 left-4"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <Badge variant="destructive" className="px-3 py-1.5 text-sm font-medium shadow-lg">
                        PROMO
                      </Badge>
                    </motion.div>
                  )}
                  
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium border-white/20">
                      {ebook.format?.[0] || 'PDF'}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {ebook.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 mb-4 leading-relaxed line-clamp-2 md:line-clamp-2 lg:line-clamp-3 text-sm">
                    {ebook.id === "vendre-avec-0f"
                      ? "Comment j’ai généré mes premières ventes sans site web, juste avec mon téléphone – et comment tu peux faire pareil."
                      : ebook.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-400">{ebook.pages} pages</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-400">{ebook.language}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start justify-between pt-4 border-t border-white/10 gap-3">
                    <div className="flex flex-col md:flex-col lg:flex-row items-start md:items-start lg:items-end justify-between w-full gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-kheops-gold">
                          {formatPrice(ebook.price)}
                        </span>
                        {ebook.isOnSale && ebook.originalPrice && (
                          <span className="text-sm sm:text-base lg:text-lg text-gray-500 line-through">
                            {formatPrice(ebook.originalPrice)}
                          </span>
                        )}
                      </div>
                      <Link 
                        to={`/boutique/${ebook.id}`}
                        className="w-full md:w-full lg:w-auto inline-flex items-center justify-center px-4 py-2 text-sm bg-gradient-to-r from-kheops-gold to-kheops-salmon hover:from-kheops-gold/90 hover:to-kheops-salmon/90 text-white font-medium rounded-full transition-all duration-300 shadow-lg transform hover:scale-105"
                        onClick={() => ReactGA.event({ category: 'ShopSection', action: 'Click Ebook', label: ebook.title })}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        <span className="whitespace-nowrap">En savoir plus</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Link to="/boutique">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-kheops-gold to-kheops-salmon hover:from-kheops-gold/90 hover:to-kheops-salmon/90 text-white px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Découvrir tous nos e-books
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopSection;
