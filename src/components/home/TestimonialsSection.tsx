import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useState, useEffect, TouchEvent } from 'react';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  imageUrl?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Michel BÉLANGER",
    position: "Manager",
    company: "Joe Beef",
    content: "Depuis notre collaboration avec KHEOPS SET DIGITAL, notre restaurant a vu ses réservations en ligne bondir de 30%. Leur approche personnalisée et leur réactivité ont transformé notre visibilité numérique en un véritable atout concurrentiel."
  },
  {
    id: 2,
    name: "Pascal KABEYA",
    position: "DG",
    company: "Maboke Market",
    content: "Grâce à KHEOPS SET DIGITAL, notre marché de produits locaux a pu se digitaliser efficacement. Leur solution sur mesure a simplifié notre gestion et augmenté notre visibilité en ligne de manière significative. Une très belle collaboration !"
  },
  {
    id: 3,
    name: "Aminatou OUSMANOU",
    position: "Gérante",
    company: "Miel d'Abong-Mbang",
    content: "Depuis que KHEOPS SET DIGITAL gère notre présence en ligne, nous avons doublé nos ventes de miel local. Leur stratégie digitale a permis à notre petite entreprise familiale de toucher des clients dans tout le Cameroun."
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleTransition = (newIndex: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  };

  // Configuration du swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleTransition((currentIndex + 1) % testimonials.length);
    }
    if (isRightSwipe) {
      handleTransition((currentIndex - 1 + testimonials.length) % testimonials.length);
    }
  };

  useEffect(() => {
    if (isMobile && !isTransitioning) {
      const interval = setInterval(() => {
        handleTransition((currentIndex + 1) % testimonials.length);
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [currentIndex, isTransitioning, isMobile]);

  const renderTestimonial = (testimonial: Testimonial, index: number) => (
    <motion.div
      key={testimonial.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white p-8 rounded-xl shadow-lg relative"
    >
      <div className="absolute -top-5 -left-5 w-10 h-10 bg-kheops-gold/10 rounded-full flex items-center justify-center">
        <Quote size={20} className="text-kheops-gold" />
      </div>
      
      <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
      
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-kheops-gold/20 flex items-center justify-center text-kheops-gold font-bold mr-4">
          {testimonial.imageUrl ? (
            <img src={testimonial.imageUrl} alt={testimonial.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            testimonial.name.charAt(0)
          )}
        </div>
        <div>
          <h4 className="font-bold">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.position}, {testimonial.company}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="section-padding bg-white" id="testimonials">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">Ce que disent nos <span className="text-kheops-gold">Clients</span></h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Découvrez pourquoi nos clients nous font confiance pour leurs projets digitaux.
          </p>
        </div>

        <div className="relative">
          {isMobile ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ 
                  duration: 0.7,
                  ease: [0.4, 0, 0.2, 1],
                  opacity: { duration: 0.5 }
                }}
                className="grid grid-cols-1 gap-8"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {renderTestimonial(testimonials[currentIndex], 0)}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => renderTestimonial(testimonial, index))}
            </div>
          )}

          {/* Indicateurs de pagination pour mobile */}
          {isMobile && (
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => !isTransitioning && handleTransition(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? "bg-kheops-gold w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Témoignage ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
