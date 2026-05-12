import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Check, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const NewsletterSection = () => {

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

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
    
    if (!email || !email.includes('@')) {
      toast.error('Erreur', {
        description: 'Veuillez entrer une adresse e-mail valide.',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const locationData = await getVisitorLocation();
      const formData = {
        email,
        _subject: 'Nouvelle inscription à la newsletter - Page d\'accueil',
        subscriptionType: 'Newsletter',
        source: 'Homepage',
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
        setIsSubmitted(true);
        toast.success('Inscription réussie !', {
          description: 'Merci de vous être abonné à notre newsletter.',
        });
        setEmail('');
      } else {
        throw new Error('Erreur lors de l\'inscription');
      }
    } catch (error) {
      toast.error('Erreur', {
        description: 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-kheops-gold/5 via-kheops-salmon/10 to-kheops-gold/5 relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-0 -left-10 w-40 h-40 rounded-full bg-kheops-salmon blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-kheops-gold blur-3xl"></div>
        <div className="absolute top-20 right-20 w-20 h-20 rounded-full bg-kheops-teal blur-xl"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-kheops-gold to-kheops-salmon flex items-center justify-center mb-6 text-white">
                <Mail size={28} />
              </div>
              <motion.h2 
                className="mb-4 text-3xl md:text-4xl font-bold"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Restez à la pointe de <span className="text-kheops-gold">l'innovation</span>
              </motion.h2>
              <motion.p 
                className="text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Recevez nos derniers conseils, tendances et promotions exclusives directement dans votre boîte mail.
              </motion.p>
            </div>
            
            <div className="flex-1 w-full">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-green-50 rounded-lg p-6 text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="text-green-600" size={30} />
                    </div>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Merci de vous être inscrit!</h3>
                    <p className="text-green-600">Votre première newsletter arrivera bientôt.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    className="flex flex-col md:flex-row gap-4 items-stretch"
                    onSubmit={handleSubmit}
                  >
                    <div className="relative flex-1">
                      <Input
                        type="email"
                        placeholder="Votre email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/90 backdrop-blur-sm border-kheops-gold/20 focus:border-kheops-gold focus:ring-kheops-gold transition-all duration-300 pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Mail className="text-kheops-gold/50 transition-colors duration-300" />
                      </div>
                    </div>
                    <Button 
                      type="submit"
                      className="w-full md:w-auto bg-gradient-to-br from-kheops-gold to-kheops-salmon hover:from-kheops-gold/90 hover:to-kheops-salmon/90 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      disabled={isLoading}
                      onClick={() => ReactGA.event({ category: 'NewsletterSection', action: 'Click Subscribe', label: 'S\'abonner' })}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4 transition-transform duration-300" />
                          <span className="transition-opacity duration-300">
                            {isHovering ? 'Je m\'abonne' : 'S\'abonner'}
                          </span>
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
