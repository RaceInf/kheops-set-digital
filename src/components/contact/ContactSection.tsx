import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable parallax on small screens (mobile)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }
    const handleParallax = () => {
      if (sectionRef.current) {
        const scrolled = window.scrollY;
        const parallaxElements = sectionRef.current.querySelectorAll('.parallax');
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

  return (
    <section className="py-16 bg-white overflow-hidden" id="contact" ref={sectionRef}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative">
          {/* Cercle décoratif avec parallaxe */}
          <div 
            className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-kheops-salmon/10 parallax pointer-events-none" 
            data-speed="0.3"
          ></div>
          <div 
            className="absolute top-1/3 -right-20 w-60 h-60 rounded-full bg-kheops-gold/10 parallax pointer-events-none" 
            data-speed="0.5"
          ></div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:order-2"
          >
            <ContactForm />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:order-1"
          >
            <ContactInfo />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
