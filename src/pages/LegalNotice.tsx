import React, { useEffect, useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { FileText, Building, User, Server, Copyright, Link as LinkIcon, ChevronDown, ChevronUp, Shield, Scale, Globe, BookOpen } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Seo from '@/components/seo/Seo';

// Composant pour l'effet de particules en arrière-plan avec optimisation par appareil
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particleCount = deviceType === 'mobile' ? 20 : deviceType === 'tablet' ? 35 : 50;
      const maxSize = deviceType === 'mobile' ? 1.5 : deviceType === 'tablet' ? 2 : 2.5;
      const maxSpeed = deviceType === 'mobile' ? 0.3 : deviceType === 'tablet' ? 0.4 : 0.5;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * maxSize + 0.5,
          speedX: (Math.random() * maxSpeed - maxSpeed/2) * (deviceType === 'mobile' ? 0.5 : 1),
          speedY: (Math.random() * maxSpeed - maxSpeed/2) * (deviceType === 'mobile' ? 0.5 : 1),
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234, 179, 8, ${particle.opacity})`;
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    const animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [deviceType]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "fixed inset-0 pointer-events-none z-0",
        deviceType === 'mobile' ? "opacity-20" : deviceType === 'tablet' ? "opacity-25" : "opacity-30"
      )}
    />
  );
};

// Composant pour la carte 3D interactive avec optimisation par appareil
const LegalCard = ({ 
  icon: Icon, 
  title, 
  content, 
  delay = 0,
  isActive,
  onClick,
  deviceType,
  fullWidth = false 
}: { 
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
  delay?: number;
  isActive: boolean;
  onClick: () => void;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  fullWidth?: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, deviceType === 'mobile' ? 2 : deviceType === 'tablet' ? 3 : 5]),
    { stiffness: deviceType === 'mobile' ? 50 : 100 }
  );
  const rotateY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, deviceType === 'mobile' ? -2 : deviceType === 'tablet' ? -3 : -5]),
    { stiffness: deviceType === 'mobile' ? 50 : 100 }
  );

  const handleClick = () => {
    onClick();
    if (cardRef.current) {
      const headerOffset = deviceType === 'mobile' ? 80 : deviceType === 'tablet' ? 100 : 120;
      const elementPosition = cardRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: deviceType === 'mobile' ? 20 : 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: deviceType === 'mobile' ? 0.3 : 0.5,
        delay: deviceType === 'mobile' ? delay * 0.5 : delay 
      }}
      style={{ perspective: deviceType === 'mobile' ? 500 : 1000 }}
      className={cn(
        "relative",
        fullWidth ? "w-full" : deviceType === 'mobile' ? "w-full" : deviceType === 'tablet' ? "w-full md:w-1/2" : "w-full md:w-1/2 lg:w-1/3"
      )}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className={cn(
          "relative bg-white/80 backdrop-blur-lg rounded-2xl cursor-pointer",
          "transform-gpu transition-all duration-500",
          "border border-kheops-gold/20",
          fullWidth ? "w-full" : "",
          deviceType === 'mobile' 
            ? "hover:shadow-lg hover:scale-[1.02] p-3" 
            : deviceType === 'tablet'
            ? "hover:shadow-xl hover:scale-[1.03] p-5"
            : "hover:shadow-2xl hover:scale-105 p-6",
          isActive 
            ? deviceType === 'mobile'
              ? "shadow-lg scale-[1.02]"
              : deviceType === 'tablet'
              ? "shadow-xl scale-[1.03]"
              : "shadow-xl scale-105"
            : "shadow-lg",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-kheops-gold/5 before:to-kheops-salmon/5 before:rounded-2xl before:-z-10"
        )}
        onClick={handleClick}
        whileHover={{ 
          scale: deviceType === 'mobile' ? 1.02 : deviceType === 'tablet' ? 1.03 : 1.05 
        }}
        whileTap={{ 
          scale: deviceType === 'mobile' ? 0.98 : 0.99 
        }}
      >
        <div className={cn(
          "flex items-center gap-3",
          deviceType === 'mobile' ? "gap-2" : "gap-4",
          "min-h-[48px]"
        )}>
          <div className={cn(
            "flex items-center justify-center",
            deviceType === 'mobile' 
              ? "p-2 min-w-[32px] h-8" 
              : deviceType === 'tablet'
              ? "p-2.5 min-w-[36px] h-9"
              : "p-3 min-w-[40px] h-10",
            "rounded-xl bg-gradient-to-br from-kheops-gold to-kheops-salmon text-white"
          )}>
            <Icon className={cn(
              deviceType === 'mobile' ? "w-4 h-4" : deviceType === 'tablet' ? "w-5 h-5" : "w-6 h-6"
            )} />
          </div>
          <h3 className={cn(
            "font-semibold bg-gradient-to-r from-kheops-gold to-kheops-salmon bg-clip-text text-transparent",
            deviceType === 'mobile' ? "text-base leading-tight" : deviceType === 'tablet' ? "text-lg leading-tight" : "text-xl leading-tight",
            "flex-1 self-center mt-4"
          )}>
            {title}
          </h3>
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex items-center justify-center",
              deviceType === 'mobile' 
                ? "w-6 h-6" 
                : deviceType === 'tablet'
                ? "w-7 h-7"
                : "w-8 h-8"
            )}
          >
            <svg
              className={cn(
                "w-full h-full text-kheops-gold transition-colors duration-300",
                isActive ? "text-kheops-salmon" : ""
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: deviceType === 'mobile' ? 0.2 : 0.3,
                ease: "easeInOut"
              }}
              className="overflow-hidden"
            >
              <div className={cn(
                "pt-4 border-t border-kheops-gold/20",
                deviceType === 'mobile' ? "pt-3" : "pt-4"
              )}>
                <div className={cn(
                  "prose prose-sm sm:prose-base max-w-none",
                  deviceType === 'mobile' ? "prose-sm" : deviceType === 'tablet' ? "prose-base" : "prose-lg",
                  "prose-headings:text-kheops-gold prose-headings:font-semibold",
                  "prose-p:text-gray-600 prose-p:leading-relaxed",
                  "prose-ul:text-gray-600 prose-ul:leading-relaxed",
                  "prose-li:marker:text-kheops-gold",
                  "prose-a:text-kheops-gold prose-a:no-underline hover:prose-a:text-kheops-salmon",
                  "prose-strong:text-kheops-gold"
                )}>
                  {content}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const LegalNotice = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Effet pour forcer le défilement en haut de page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    {
      id: "informations",
      icon: Building,
      title: "Informations Générales",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Bienvenue chez KHEOPS SET DIGITAL, votre partenaire de confiance en communication digitale.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              title="Raison sociale"
              value="KHEOPS SET DIGITAL"
              icon={Building}
              deviceType={deviceType}
            />
            <InfoCard
              title="Forme juridique"
              value="SARL"
              icon={Scale}
              deviceType={deviceType}
            />
            <InfoCard
              title="Capital social"
              value="1 000 000 FCFA"
              icon={Shield}
              deviceType={deviceType}
            />
            <InfoCard
              title="Siège social"
              value="Logpom, Douala, Cameroun"
              icon={Globe}
              deviceType={deviceType}
            />
            <InfoCard
              title="Registre de Commerce"
              value="RC/DLA/2022/B/05678"
              icon={FileText}
              deviceType={deviceType}
            />
            <InfoCard
              title="NIF"
              value="M0923456789123"
              icon={BookOpen}
              deviceType={deviceType}
            />
            <InfoCard
              title="Téléphone"
              value="+237 612 345 678"
              icon={User}
              deviceType={deviceType}
            />
            <InfoCard
              title="Email"
              value={
                <a
                  href="mailto:privacy@kheopsetdigital.com"
                  className="text-kheops-gold hover:text-kheops-salmon transition-colors duration-300"
                >
                  privacy@kheopsetdigital.com
                </a>
              }
              icon={LinkIcon}
              deviceType={deviceType}
            />
          </div>
        </div>
      ),
    },
    {
      id: "direction",
      icon: User,
      title: "Direction de la Publication",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Notre site est dirigé avec passion et expertise par Kheops Set, qui assure la direction éditoriale et stratégique.
          </p>
          <div className="bg-gradient-to-br from-kheops-gold/10 to-kheops-salmon/10 p-6 rounded-xl">
            <h4 className="font-semibold text-lg mb-2">Engagement Qualité</h4>
            <p className="text-gray-600">
              Nous nous engageons à maintenir les plus hauts standards de qualité et d'éthique dans toutes nos publications.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "hebergement",
      icon: Server,
      title: "Hébergement",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Notre site est hébergé par OVHcloud, garantissant une performance et une sécurité optimales.
          </p>
          <div className="bg-gradient-to-br from-kheops-gold/10 to-kheops-salmon/10 p-6 rounded-xl">
            <h4 className="font-semibold text-lg mb-2">Infrastructure Premium</h4>
            <p className="text-gray-600">
              OVHcloud, 2 Rue Kellermann, Roubaix, France - Leader européen de l'hébergement cloud.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "propriete",
      icon: Copyright,
      title: "Propriété Intellectuelle",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Tous nos contenus sont protégés par les droits d'auteur et la propriété intellectuelle.
          </p>
          <div className="bg-gradient-to-br from-kheops-gold/10 to-kheops-salmon/10 p-6 rounded-xl">
            <h4 className="font-semibold text-lg mb-2">Protection des Droits</h4>
            <p className="text-gray-600">
              Toute reproduction ou utilisation non autorisée est strictement interdite et fera l'objet de poursuites.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "liens",
      icon: LinkIcon,
      title: "Liens Hypertextes",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Nous sélectionnons avec soin nos liens externes pour garantir une expérience utilisateur de qualité.
          </p>
          <div className="bg-gradient-to-br from-kheops-gold/10 to-kheops-salmon/10 p-6 rounded-xl">
            <h4 className="font-semibold text-lg mb-2">Politique de Liens</h4>
            <p className="text-gray-600">
              Nous ne pouvons être tenus responsables du contenu des sites externes vers lesquels nous créons des liens.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "juridiction",
      icon: Scale,
      title: "Droit Applicable",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Notre site est soumis à la législation camerounaise, garantissant une protection juridique complète.
          </p>
          <div className="bg-gradient-to-br from-kheops-gold/10 to-kheops-salmon/10 p-6 rounded-xl">
            <h4 className="font-semibold text-lg mb-2">Juridiction</h4>
            <p className="text-gray-600">
              En cas de litige, les tribunaux camerounais seront seuls compétents.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Seo page="mentions-legales" />
      <Helmet>
        <title>Mentions Légales | KHEOPS SET DIGITAL - Informations Juridiques</title>
        <meta name="description" content="Consultez les mentions légales de KHEOPS SET DIGITAL : informations juridiques, propriété intellectuelle, conditions d'utilisation et protection des données personnelles." />
        <meta name="keywords" content="mentions légales, KHEOPS SET DIGITAL, informations juridiques, propriété intellectuelle, conditions d'utilisation, protection des données, RGPD, Cameroun" />
        <link rel="canonical" href="https://kheopsetdigital.com/mentions-legales" />
        <meta name="publisher" content="KHEOPS SET DIGITAL" />
        <meta property="og:title" content="Mentions Légales | KHEOPS SET DIGITAL" />
        <meta property="og:description" content="Consultez les mentions légales de KHEOPS SET DIGITAL : informations juridiques, propriété intellectuelle, conditions d'utilisation et protection des données personnelles." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kheopsetdigital.com/mentions-legales" />
        <meta property="og:image" content="https://kheopsetdigital.com/images/og/legal.jpg" />
        <meta property="og:image:alt" content="Mentions Légales KHEOPS SET DIGITAL" />
        <meta name="robots" content="noindex, follow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mentions Légales | KHEOPS SET DIGITAL" />
        <meta name="twitter:description" content="Consultez les mentions légales de KHEOPS SET DIGITAL : informations juridiques, propriété intellectuelle, conditions d'utilisation et protection des données personnelles." />
        <meta name="twitter:image" content="https://kheopsetdigital.com/images/og/legal.jpg" />
        <meta name="twitter:image:alt" content="Mentions Légales KHEOPS SET DIGITAL" />
      </Helmet>
      
      <main className={cn(
        "min-h-screen w-full bg-gradient-to-b from-white via-gray-50 to-kheops-lightGray overflow-hidden",
        deviceType === 'mobile' ? "text-sm" : deviceType === 'tablet' ? "text-base" : "text-base"
      )}>
        <ParticleBackground />
        <Navbar />
        


        <div ref={containerRef} className="relative">
          {/* En-tête avec effet de parallaxe et animation 3D */}
          <div className={cn(
            "relative flex items-center justify-center overflow-hidden",
            deviceType === 'mobile' 
              ? "h-[40vh] min-h-[300px]" 
              : deviceType === 'tablet'
              ? "h-[50vh] min-h-[350px]"
              : "h-[60vh] min-h-[400px]"
          )}>
            <motion.div
              style={{
                scale: useTransform(
                  scrollYProgress,
                  [0, 1],
                  deviceType === 'mobile' 
                    ? [1, 1.1] 
                    : deviceType === 'tablet'
                    ? [1, 1.15]
                    : [1, 1.2]
                ),
                opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0])
              }}
              className="absolute inset-0 bg-gradient-to-br from-kheops-gold/20 via-kheops-salmon/20 to-transparent"
            >
              <div className={cn(
                "absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)]",
                deviceType === 'mobile' 
                  ? "bg-[size:20px_20px]" 
                  : deviceType === 'tablet'
                  ? "bg-[size:25px_25px]"
                  : "bg-[size:30px_30px]"
              )}></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: deviceType === 'mobile' ? 20 : 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: deviceType === 'mobile' ? 0.6 : 1,
                delay: deviceType === 'mobile' ? 0.1 : 0.2
              }}
              className="relative z-10 text-center px-4"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: deviceType === 'mobile' ? 0.6 : 0.8,
                  delay: deviceType === 'mobile' ? 0.2 : 0.4
                }}
                className={cn(
                  "font-bold mb-4",
                  deviceType === 'mobile'
                    ? "text-3xl mb-3"
                    : deviceType === 'tablet'
                    ? "text-4xl mb-4"
                    : "text-5xl mb-6"
                )}
              >
                <span className="bg-gradient-to-r from-kheops-gold to-kheops-salmon bg-clip-text text-transparent">
                  Mentions Légales
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: deviceType === 'mobile' ? 0.6 : 0.8,
                  delay: deviceType === 'mobile' ? 0.3 : 0.6
                }}
                className={cn(
                  "text-gray-600 max-w-2xl mx-auto",
                  deviceType === 'mobile'
                    ? "text-sm"
                    : deviceType === 'tablet'
                    ? "text-base"
                    : "text-lg"
                )}
              >
                Transparence et confiance sont au cœur de notre engagement
              </motion.p>
            </motion.div>
          </div>

          {/* Contenu principal avec cartes 3D */}
          <div className={cn(
            "container mx-auto relative z-10 pb-20",
            deviceType === 'mobile'
              ? "px-4 -mt-12"
              : deviceType === 'tablet'
              ? "px-6 -mt-20"
              : "px-8 -mt-28"
          )}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: deviceType === 'mobile' ? 0.3 : 0.5,
                delay: deviceType === 'mobile' ? 0.4 : 0.8
              }}
              className={cn(
                "flex flex-col",
                deviceType === 'mobile' || deviceType === 'tablet'
                  ? "space-y-6"
                  : "space-y-8"
              )}
            >
              {/* Première carte - Informations Générales */}
              <motion.div className="w-full">
                <LegalCard
                  icon={sections[0].icon}
                  title={sections[0].title}
                  content={sections[0].content}
                  delay={0}
                  isActive={activeSection === sections[0].id}
                  onClick={() => setActiveSection(activeSection === sections[0].id ? null : sections[0].id)}
                  deviceType={deviceType}
                  fullWidth={true}
                />
              </motion.div>

              {/* Deuxième et troisième carte - Direction et Hébergement */}
              <motion.div
                className={cn(
                  deviceType === 'desktop' 
                    ? "grid lg:grid-cols-2 gap-6" 
                    : "flex flex-col space-y-6"
                )}
              >
                {sections.slice(1, 3).map((section, index) => (
                  <motion.div
                    key={section.id}
                    className="w-full"
                  >
                    <LegalCard
                      icon={section.icon}
                      title={section.title}
                      content={section.content}
                      delay={(index + 1) * (deviceType === 'mobile' ? 0.05 : 0.1)}
                      isActive={activeSection === section.id}
                      onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                      deviceType={deviceType}
                      fullWidth={true}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Quatrième et cinquième carte - Propriété et Liens */}
              <motion.div
                className={cn(
                  deviceType === 'desktop' 
                    ? "grid lg:grid-cols-2 gap-6" 
                    : "flex flex-col space-y-6"
                )}
              >
                {sections.slice(3, 5).map((section, index) => (
                  <motion.div
                    key={section.id}
                    className="w-full"
                  >
                    <LegalCard
                      icon={section.icon}
                      title={section.title}
                      content={section.content}
                      delay={(index + 3) * (deviceType === 'mobile' ? 0.05 : 0.1)}
                      isActive={activeSection === section.id}
                      onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                      deviceType={deviceType}
                      fullWidth={true}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Dernière carte - Droit Applicable */}
              <motion.div className="w-full">
                <LegalCard
                  icon={sections[5].icon}
                  title={sections[5].title}
                  content={sections[5].content}
                  delay={5 * (deviceType === 'mobile' ? 0.05 : 0.1)}
                  isActive={activeSection === sections[5].id}
                  onClick={() => setActiveSection(activeSection === sections[5].id ? null : sections[5].id)}
                  deviceType={deviceType}
                  fullWidth={true}
                />
              </motion.div>
            </motion.div>

            {/* Date de mise à jour */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: deviceType === 'mobile' ? 0.3 : 0.5,
                delay: deviceType === 'mobile' ? 0.6 : 1.2
              }}
              className={cn(
                "text-center mt-8"
              )}
            >
              <p className={cn(
                "text-gray-500",
                deviceType === 'mobile' ? "text-xs" : "text-sm"
              )}>
                Dernière mise à jour :{" "}
                {new Date().toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </motion.div>
          </div>
        </div>
        
        <Footer />
      </main>
    </>
  );
};

// Composant pour les cartes d'information avec optimisation par appareil
const InfoCard = ({ 
  title, 
  value, 
  icon: Icon,
  deviceType 
}: { 
  title: string;
  value: React.ReactNode;
  icon: React.ElementType;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}) => (
  <motion.div
    whileHover={{ 
      scale: deviceType === 'mobile' ? 1.01 : deviceType === 'tablet' ? 1.02 : 1.03 
    }}
    className={cn(
      "bg-white/80 backdrop-blur-sm rounded-xl border border-kheops-gold/20 hover:border-kheops-gold/40 transition-colors duration-300",
      deviceType === 'mobile'
        ? "p-3"
        : deviceType === 'tablet'
        ? "p-4"
        : "p-5"
    )}
  >
    <div className={cn(
      "flex items-center gap-2 min-h-[32px]",
      deviceType === 'mobile' ? "gap-2" : "gap-3"
    )}>
      <div className={cn(
        "flex items-center justify-center",
        deviceType === 'mobile' 
          ? "p-1.5 min-w-[24px] h-6" 
          : deviceType === 'tablet'
          ? "p-2 min-w-[28px] h-7"
          : "p-3 min-w-[40px] h-10",
        "rounded-lg bg-kheops-gold/10 text-kheops-gold"
      )}>
        <Icon className={cn(
          deviceType === 'mobile' ? "w-3.5 h-3.5" : deviceType === 'tablet' ? "w-4 h-4" : "w-6 h-6"
        )} />
      </div>
      <h4 className={cn(
        "font-medium text-gray-700 flex items-center",
        deviceType === 'mobile' ? "text-sm leading-tight" : "text-base leading-tight"
      )}>
        {title}
      </h4>
    </div>
    <div className={cn(
      "text-gray-600 flex items-center",
      deviceType === 'mobile' ? "text-sm pl-8 mt-1" : "text-base pl-11 mt-1.5"
    )}>
      {value}
    </div>
  </motion.div>
);

export default LegalNotice;
