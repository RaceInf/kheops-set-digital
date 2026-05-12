import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactGA from 'react-ga4';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    '/images/og/home.jpg',
    '/images/home03.jpeg',
    '/images/home02.jpeg',
  ];

  useEffect(() => {
    // Disable parallax on small screens (mobile)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }
    const handleParallax = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        const parallaxElements = heroRef.current.querySelectorAll('.parallax');
        parallaxElements.forEach((el) => {
          const speed = parseFloat((el as HTMLElement).dataset.speed || '0.5');
          const pos = scrolled * speed;
          (el as HTMLElement).style.transform = `translateY(${pos}px)`;
        });
      }
    };

    window.addEventListener('scroll', handleParallax);
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  // Auto-rotation des images: 5s, tous appareils, sans pause
  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [images.length]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32" ref={heroRef}>
      {/* Cercles décoratifs avec effet parallaxe */}
      <div 
        className="absolute -top-20 -right-40 w-80 h-80 rounded-full bg-kheops-gold/10 parallax" 
        data-speed="0.3"
      ></div>
      <div 
        className="absolute top-1/3 -left-20 w-60 h-60 rounded-full bg-kheops-salmon/10 parallax" 
        data-speed="0.5"
      ></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Votre succès en ligne commence{' '}
              <span className="text-kheops-gold">ici et maintenant</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
              <span className="font-semibold text-black block">97% des consommateurs recherchent d'abord en ligne avant d'acheter.</span>
              <br /><br />
              Et si votre entreprise n'est pas visible, vous perdez chaque jour des clients au profit de vos concurrents. 
              <span className="font-medium text-kheops-gold"> Nous transformons cette opportunité en réalité</span> avec des stratégies digitales sur-mesure qui génèrent des résultats concrets et mesurables pour votre entreprise.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/contact" className="group">
                <Button className="bg-kheops-gold hover:bg-kheops-gold/90 text-white px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  onClick={() => ReactGA.event({ category: 'HeroSection', action: 'Click Audit', label: 'Obtenir un audit gratuit' })}>
                  Obtenir un audit gratuit
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/apropos" className="group">
                <Button variant="outline" className="border-kheops-gold text-kheops-gold hover:bg-kheops-gold/10 px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  onClick={() => ReactGA.event({ category: 'HeroSection', action: 'Click About', label: 'Qui sommes-nous ?' })}>
                  Qui sommes-nous ?
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-2 rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative w-full h-auto">
                {images.map((src, idx) => (
                  <motion.img
                    key={src}
                    src={src}
                    alt="Tableau de bord de gestion de projet"
                    className={`rounded-xl w-full h-auto ${idx === 0 ? 'relative' : 'absolute inset-0'} ${idx === 0 ? '' : 'filter grayscale contrast-125 brightness-90'}`}
                    initial={{ opacity: idx === currentIndex ? 1 : 0 }}
                    animate={{ opacity: idx === currentIndex ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    style={{ position: idx === 0 ? 'relative' as const : 'absolute' as const }}
                  />
                ))}
                {/* Overlay gradient pour lisibilité */}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
              </div>
            </div>
            {/* Éléments flottants */}
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg z-20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center">
                <div className="bg-kheops-gold/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-kheops-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-semibold">+250%</p>
                  <p className="text-sm text-gray-500">de visibilité</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg z-20"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="flex items-center">
                <div className="bg-kheops-salmon/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-kheops-salmon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-semibold">+300%</p>
                  <p className="text-sm text-gray-500">de ROI moyen</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
