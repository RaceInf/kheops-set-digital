import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Twitter, ArrowUp, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ReactGA from 'react-ga4';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getVisitorLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        country: data.country_name,
        countryCode: data.country_code,
        city: data.city,
        region: data.region
      };
    } catch (error) {
      console.error('Erreur lors de la détection de la localisation:', error);
      return {
        country: 'Inconnu',
        countryCode: 'XX',
        city: 'Inconnu',
        region: 'Inconnu'
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Erreur', {
        description: 'Veuillez entrer une adresse e-mail valide.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const locationData = await getVisitorLocation();
      const formData = {
        email,
        _subject: 'Nouvelle inscription à la newsletter - Pied de page',
        subscriptionType: 'Newsletter',
        source: 'Footer',
        page: location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || 'Direct',
        location: locationData
      };

      const response = await fetch('https://formspree.io/f/xwplbrgv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Inscription réussie !', {
          description: 'Merci de vous être abonné à notre newsletter.',
        });
        setEmail('');
      } else {
        throw new Error('Erreur lors de l\'inscription');
      }
    } catch (error) {
      toast.error('Erreur', {
        description: "Une erreur est survenue lors de l'inscription.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      {/* Back to top button */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="bg-kheops-gold hover:bg-kheops-salmon text-white p-3 rounded-full transition-colors duration-300 shadow-lg"
          aria-label="Retour en haut de page"
        >
          <ArrowUp size={24} />
        </motion.button>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-3 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="font-poppins text-xl font-bold mb-4">
              <span className="text-kheops-gold">KHEOPS</span> 
              <span className="text-kheops-salmon">SET</span> 
              <span>DIGITAL</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Votre partenaire en stratégie digitale et communication visuelle. Nous transformons vos idées en expériences mémorables.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://web.facebook.com/kheopset.digital/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-kheops-gold transition-colors duration-300"
                aria-label="Facebook"
                onClick={() => ReactGA.event({ category: 'Footer', action: 'Click Social', label: 'Facebook' })}
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-3 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="font-poppins text-xl font-bold mb-4">Nos services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/community-management" className="text-gray-300 hover:text-kheops-salmon transition-colors duration-300">
                  Community Management
                </Link>
              </li>
              <li>
                <Link to="/services/creation-sites-web" className="text-gray-300 hover:text-kheops-salmon transition-colors duration-300">
                  Création de sites web
                </Link>
              </li>
              <li>
                <Link to="/services/identite-visuelle" className="text-gray-300 hover:text-kheops-salmon transition-colors duration-300">
                  Identité visuelle
                </Link>
              </li>
              <li>
                <Link to="/services/strategie-digitale" className="text-gray-300 hover:text-kheops-salmon transition-colors duration-300">
                  Stratégie digitale
                </Link>
              </li>
              <li>
                <Link to="/services/referencement-seo" className="text-gray-300 hover:text-kheops-salmon transition-colors duration-300">
                  SEO
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact et Newsletter côte à côte */}
          <div className="md:col-span-2 lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
              <h3 className="font-poppins text-xl font-bold mb-4">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin size={20} className="text-kheops-gold mt-1 mr-3 flex-shrink-0" />
                  <address className="text-gray-300 not-italic">
                    Logpom, Douala, Cameroun
                  </address>
                </li>
                <li className="flex items-center">
                  <Phone size={20} className="text-kheops-gold mr-3 flex-shrink-0" />
                  <a href="tel:+237612345678" className="text-gray-300 hover:text-white" onClick={() => ReactGA.event({ category: 'Footer', action: 'Click Contact', label: 'Téléphone' })}>+237 612 345 678</a>
                </li>
                <li className="flex items-center">
                  <Mail size={20} className="text-kheops-gold mr-3 flex-shrink-0" />
                  <a href="mailto:ksd@kheopsetdigital.com" className="text-gray-300 hover:text-white" onClick={() => ReactGA.event({ category: 'Footer', action: 'Click Contact', label: 'Email' })}>ksd@kheopsetdigital.com</a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
              <h3 className="font-poppins text-xl font-bold mb-4">Newsletter</h3>
              <p className="text-gray-300 mb-4 text-sm">
                Recevez nos dernières actualités et offres spéciales directement dans votre boîte mail.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-3">
                <div className="flex-1">
                  <label htmlFor="email-newsletter" className="sr-only">Votre email</label>
                  <input
                    type="email"
                    id="email-newsletter"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kheops-gold focus:border-transparent text-sm"
                    placeholder="Votre adresse email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-kheops-gold hover:bg-kheops-salmon text-white rounded-md transition-colors duration-300 text-sm font-medium whitespace-nowrap"
                  onClick={() => ReactGA.event({ category: 'Footer', action: 'Click Newsletter', label: "S'inscrire" })}
                >
                  {isSubmitting ? 'Envoi...' : "S'inscrire"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:items-center">
          <p className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">
            © 2025 KHEOPS SET DIGITAL. Tous droits réservés.
          </p>
          <div className="mt-4 md:mt-0 text-xs sm:text-sm text-gray-400 flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-2">
            <Link 
              to="/mentions-legales" 
              className="hover:text-kheops-salmon transition-colors duration-300 whitespace-nowrap"
            >
              Mentions légales
            </Link>
            <Link 
              to="/politique-de-confidentialite" 
              className="hover:text-kheops-salmon transition-colors duration-300 whitespace-nowrap"
            >
              Politique de confidentialité
            </Link>
            <Link 
              to="/conditions-generales-de-vente" 
              className="hover:text-kheops-salmon transition-colors duration-300 whitespace-nowrap"
            >
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
