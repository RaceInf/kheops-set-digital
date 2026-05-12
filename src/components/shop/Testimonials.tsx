import React, { useEffect, useState, TouchEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  ebook: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Détection de la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // sm breakpoint
      setIsTablet(width >= 768 && width < 1024); // md breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const testimonialsPerPage = isMobile || isTablet ? 1 : 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  // Configuration du swipe
  const minSwipeDistance = 50;

  const handleTransition = (newIndex: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    // Réinitialiser l'état de transition après l'animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700); // Durée de l'animation
  };

  useEffect(() => {
    if (!isHovering && !isTransitioning) {
      intervalRef.current = setInterval(() => {
        handleTransition((currentIndex + 1) % totalPages);
      }, 6000); // Augmentation du délai entre les transitions
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, totalPages, isHovering, isTransitioning]);

  const visibleTestimonials = testimonials.slice(
    currentIndex * testimonialsPerPage,
    (currentIndex + 1) * testimonialsPerPage
  );

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
      handleTransition((currentIndex + 1) % totalPages);
    }
    if (isRightSwipe) {
      handleTransition((currentIndex - 1 + totalPages) % totalPages);
    }
  };

  return (
    <div
      className={cn("py-16 overflow-hidden relative", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-white mb-12 text-center"
        >
          Ce que disent nos <span className="text-gradient">lecteurs</span>
        </motion.h2>

        <div className="relative">
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
              className={cn(
                "grid gap-8 px-4",
                isMobile || isTablet ? "grid-cols-1" : "grid-cols-3"
              )}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {visibleTestimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-kheops-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-kheops-gold/10 flex flex-col min-h-[280px]"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-kheops-gold"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full border-2 border-kheops-gold bg-kheops-gold/10 flex items-center justify-center">
                          <span className="text-kheops-gold font-semibold text-lg">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-kheops-gold rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-gray-900" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-kheops-gold transition-colors">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-400 -mt-4">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-kheops-gold fill-kheops-gold" />
                    ))}
                  </div>

                  <div className="flex-grow">
                    <p className="text-base text-gray-300 leading-relaxed mb-4">
                      {testimonial.content}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-400 group-hover:text-kheops-gold transition-colors">
                      <span className="hidden lg:inline">À propos de </span>
                      <span className="text-kheops-gold">{testimonial.ebook}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Indicateurs de pagination */}
          <div className="flex justify-center gap-3 mt-12">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => !isTransitioning && handleTransition(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-500",
                  index === currentIndex
                    ? "bg-kheops-gold w-8"
                    : "bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials; 