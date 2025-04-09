
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    <section 
      ref={heroRef}
      className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden"
      style={{ paddingTop: '80px' }}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 animate-gradient-animation"></div>
        <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-kheops-gold opacity-10 parallax" data-speed="-0.2"></div>
        <div className="absolute bottom-1/3 -right-10 w-80 h-80 rounded-full bg-kheops-salmon opacity-10 parallax" data-speed="0.3"></div>
        <div className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full bg-kheops-gold opacity-5 parallax" data-speed="-0.1"></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-kheops-salmon opacity-5 parallax" data-speed="0.2"></div>
      </div>

      {/* Hero Content */}
      <div className="container-custom z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content */}
          <motion.div 
            className="lg:col-span-7 text-center lg:text-left px-4"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
              variants={fadeIn}
            >
              <span className="bg-gradient-to-r from-kheops-gold to-kheops-salmon bg-clip-text text-transparent">Transformez</span> votre présence digitale au Cameroun
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto lg:mx-0 mb-8"
              variants={fadeIn}
            >
              Une agence de communication digitale dédiée à propulser votre marque vers de nouveaux sommets sur le marché africain.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4"
              variants={fadeIn}
            >
              <Link to="/services" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-kheops-gold hover:bg-kheops-salmon text-white px-8 py-6 rounded-md font-medium transition-all duration-300 hover:shadow-lg text-lg flex items-center justify-center">
                  Découvrez nos services
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-2 border-kheops-gold text-kheops-gold hover:bg-kheops-gold hover:text-white px-8 py-6 rounded-md font-medium transition-all duration-300 text-lg">
                  Contactez-nous
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full aspect-[4/3] md:aspect-square mx-auto max-w-md lg:max-w-none">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
                alt="Stratégie digitale" 
                className="w-full h-full object-cover rounded-2xl shadow-2xl" 
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-5 -right-5 bg-white p-3 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-kheops-salmon rounded-full"></div>
                  <span className="text-sm font-semibold">+100% Visibilité</span>
                </div>
              </div>
              
              <div className="absolute -bottom-5 -left-5 bg-white p-3 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-kheops-gold rounded-full"></div>
                  <span className="text-sm font-semibold">Expertise Locale</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <span className="text-sm text-gray-500 mb-2">Découvrir</span>
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div 
            className="w-1.5 h-3 bg-gray-400 rounded-full mt-1"
            animate={{ 
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
