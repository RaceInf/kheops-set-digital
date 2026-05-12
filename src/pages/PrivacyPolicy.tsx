import React, { useEffect, useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Eye, FileText, Clock, Globe, User, Database, AlertTriangle, RefreshCw, Mail } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

// Composant pour l'effet de particules en arrière-plan
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

// Composant pour la carte 3D interactive
const PolicyCard = ({ 
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

const PrivacyPolicy = () => {
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
      id: "intro",
      icon: Shield,
      title: "Protection de vos données",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Chez KHEOPS SET DIGITAL, nous nous engageons à protéger votre vie privée. Cette politique explique comment nous collectons, utilisons et protégeons vos données personnelles.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-kheops-gold/10 to-kheops-salmon/10 p-4 rounded-xl">
              <Lock className="text-kheops-gold mb-2" size={24} />
              <h4 className="font-semibold mb-1">Sécurité</h4>
              <p className="text-sm text-gray-600">Vos informations sont stockées de manière sécurisée</p>
            </div>
            <div className="bg-gradient-to-br from-kheops-gold/10 to-kheops-salmon/10 p-4 rounded-xl">
              <Eye className="text-kheops-gold mb-2" size={24} />
              <h4 className="font-semibold mb-1">Transparence</h4>
              <p className="text-sm text-gray-600">Nous sommes transparents sur l'utilisation de vos données</p>
            </div>
            <div className="bg-gradient-to-br from-kheops-gold/10 to-kheops-salmon/10 p-4 rounded-xl">
              <Shield className="text-kheops-gold mb-2" size={24} />
              <h4 className="font-semibold mb-1">Protection</h4>
              <p className="text-sm text-gray-600">Nous protégeons vos données selon les normes les plus strictes</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "collecte",
      icon: FileText,
      title: "Collecte des données",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Nous collectons les données personnelles que vous nous fournissez directement, comme:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-600 leading-relaxed">Nom, prénom, adresse e-mail, numéro de téléphone</li>
            <li className="text-gray-600 leading-relaxed">Informations de facturation et de paiement</li>
            <li className="text-gray-600 leading-relaxed">Préférences de communication</li>
            <li className="text-gray-600 leading-relaxed">Toute autre information que vous choisissez de nous fournir</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            Nous collectons également automatiquement certaines informations lorsque vous visitez notre site web, notamment via les cookies et technologies similaires.
          </p>
        </div>
      ),
    },
    {
      id: "utilisation",
      icon: Globe,
      title: "Utilisation des données",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Nous utilisons vos données personnelles pour:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-600 leading-relaxed">Fournir, exploiter et maintenir nos services</li>
            <li className="text-gray-600 leading-relaxed">Traiter et gérer vos achats et demandes</li>
            <li className="text-gray-600 leading-relaxed">Vous contacter concernant votre compte ou vos transactions</li>
            <li className="text-gray-600 leading-relaxed">Personnaliser votre expérience utilisateur</li>
            <li className="text-gray-600 leading-relaxed">Vous envoyer des communications marketing (avec votre consentement)</li>
            <li className="text-gray-600 leading-relaxed">Améliorer nos services et développer de nouvelles fonctionnalités</li>
            <li className="text-gray-600 leading-relaxed">Détecter et prévenir les fraudes</li>
          </ul>
        </div>
      ),
    },
    {
      id: "conservation",
      icon: Clock,
      title: "Conservation des données",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Nous conservons vos données personnelles aussi longtemps que nécessaire pour vous fournir nos services ou pour d'autres finalités essentielles, comme le respect de nos obligations légales, la résolution des litiges et l'application de nos accords.
          </p>
        </div>
      ),
    },
    {
      id: "droits",
      icon: User,
      title: "Vos droits",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Conformément aux lois applicables sur la protection des données, vous disposez des droits suivants:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-600 leading-relaxed">Droit d'accès à vos données personnelles</li>
            <li className="text-gray-600 leading-relaxed">Droit de rectification des données inexactes</li>
            <li className="text-gray-600 leading-relaxed">Droit à l'effacement de vos données</li>
            <li className="text-gray-600 leading-relaxed">Droit à la limitation du traitement</li>
            <li className="text-gray-600 leading-relaxed">Droit à la portabilité des données</li>
            <li className="text-gray-600 leading-relaxed">Droit d'opposition au traitement</li>
          </ul>
        </div>
      ),
    },
    {
      id: "cookies",
      icon: Database,
      title: "Cookies et technologies similaires",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Notre site utilise des cookies et technologies similaires pour améliorer votre expérience de navigation, analyser l'utilisation du site et personnaliser le contenu. Vous pouvez gérer vos préférences concernant les cookies via les paramètres de votre navigateur.
          </p>
        </div>
      ),
    },
    {
      id: "securite",
      icon: AlertTriangle,
      title: "Sécurité des données",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données personnelles contre la perte, l'accès non autorisé, la divulgation, l'altération ou la destruction.
          </p>
        </div>
      ),
    },
    {
      id: "modifications",
      icon: RefreshCw,
      title: "Modifications de la politique",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Nous pouvons mettre à jour cette politique de confidentialité périodiquement. La version la plus récente sera toujours disponible sur notre site web, avec la date de dernière mise à jour.
          </p>
        </div>
      ),
    },
    {
      id: "contact",
      icon: Mail,
      title: "Nous contacter",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Pour toute question concernant cette politique de confidentialité ou nos pratiques en matière de données, veuillez nous contacter à{" "}
            <a href="mailto:privacy@kheopsetdigital.com" className="text-kheops-gold hover:text-kheops-salmon transition-colors duration-300">
              privacy@kheopsetdigital.com
            </a>.
          </p>
          <div className="mt-4 p-4 bg-kheops-lightGray rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 leading-relaxed">
              Si vous souhaitez exercer vos droits ou déposer une réclamation, veuillez visiter notre{" "}
              <Link to="/contact" className="text-kheops-gold hover:text-kheops-salmon transition-colors duration-300">
                page de contact
              </Link>{" "}
              ou nous contacter directement par email.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Politique de Confidentialité | KHEOPS SET DIGITAL - Protection des Données</title>
        <meta name="description" content="Découvrez comment KHEOPS SET DIGITAL protège vos données personnelles : politique de confidentialité, cookies, droits RGPD et sécurité des informations." />
        <meta name="keywords" content="politique de confidentialité, protection des données, RGPD, cookies, vie privée, données personnelles, sécurité informatique, Cameroun" />
        <link rel="canonical" href="https://kheopsetdigital.com/politique-de-confidentialite" />
        <meta name="publisher" content="KHEOPS SET DIGITAL" />
        <meta property="og:title" content="Politique de Confidentialité | KHEOPS SET DIGITAL" />
        <meta property="og:description" content="Découvrez comment KHEOPS SET DIGITAL protège vos données personnelles : politique de confidentialité, cookies, droits RGPD et sécurité des informations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kheopsetdigital.com/politique-de-confidentialite" />
        <meta property="og:image" content="https://kheopsetdigital.com/images/og/privacy.jpg" />
        <meta property="og:image:alt" content="Politique de Confidentialité KHEOPS SET DIGITAL" />
        <meta name="robots" content="noindex, follow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Politique de Confidentialité | KHEOPS SET DIGITAL" />
        <meta name="twitter:description" content="Découvrez comment KHEOPS SET DIGITAL protège vos données personnelles : politique de confidentialité, cookies, droits RGPD et sécurité des informations." />
        <meta name="twitter:image" content="https://kheopsetdigital.com/images/og/privacy.jpg" />
        <meta name="twitter:image:alt" content="Politique de Confidentialité KHEOPS SET DIGITAL" />
      </Helmet>
      
      <main className={cn(
        "min-h-screen w-full bg-gradient-to-b from-white via-gray-50 to-kheops-lightGray overflow-hidden",
        deviceType === 'mobile' ? "text-sm" : deviceType === 'tablet' ? "text-base" : "text-base"
      )}>
        <ParticleBackground />
        <Navbar />
        


        <div ref={containerRef} className="relative">
          {/* En-tête avec effet de parallaxe */}
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
                  Politique de Confidentialité
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
                Transparence et protection de vos données sont au cœur de notre engagement
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
              {/* Cartes de contenu */}
              {deviceType === 'desktop' ? (
                <>
                  {/* Première rangée : Introduction */}
                  <motion.div className="w-full">
                    <PolicyCard
                      icon={sections[0].icon}
                      title={sections[0].title}
                      content={sections[0].content}
                      delay={0.1}
                      isActive={activeSection === sections[0].id}
                      onClick={() => setActiveSection(activeSection === sections[0].id ? null : sections[0].id)}
                      deviceType={deviceType}
                      fullWidth={true}
                    />
                  </motion.div>

                  {/* Deuxième rangée : Collecte et Utilisation */}
                  <motion.div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2">
                      <PolicyCard
                        icon={sections[1].icon}
                        title={sections[1].title}
                        content={sections[1].content}
                        delay={0.2}
                        isActive={activeSection === sections[1].id}
                        onClick={() => setActiveSection(activeSection === sections[1].id ? null : sections[1].id)}
                        deviceType={deviceType}
                        fullWidth={true}
                      />
                    </div>
                    <div className="w-full lg:w-1/2">
                      <PolicyCard
                        icon={sections[2].icon}
                        title={sections[2].title}
                        content={sections[2].content}
                        delay={0.3}
                        isActive={activeSection === sections[2].id}
                        onClick={() => setActiveSection(activeSection === sections[2].id ? null : sections[2].id)}
                        deviceType={deviceType}
                        fullWidth={true}
                      />
                    </div>
                  </motion.div>

                  {/* Troisième rangée : Conservation et Droits */}
                  <motion.div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2">
                      <PolicyCard
                        icon={sections[3].icon}
                        title={sections[3].title}
                        content={sections[3].content}
                        delay={0.4}
                        isActive={activeSection === sections[3].id}
                        onClick={() => setActiveSection(activeSection === sections[3].id ? null : sections[3].id)}
                        deviceType={deviceType}
                        fullWidth={true}
                      />
                    </div>
                    <div className="w-full lg:w-1/2">
                      <PolicyCard
                        icon={sections[4].icon}
                        title={sections[4].title}
                        content={sections[4].content}
                        delay={0.5}
                        isActive={activeSection === sections[4].id}
                        onClick={() => setActiveSection(activeSection === sections[4].id ? null : sections[4].id)}
                        deviceType={deviceType}
                        fullWidth={true}
                      />
                    </div>
                  </motion.div>

                  {/* Quatrième rangée : Cookies et Sécurité */}
                  <motion.div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2">
                      <PolicyCard
                        icon={sections[5].icon}
                        title={sections[5].title}
                        content={sections[5].content}
                        delay={0.6}
                        isActive={activeSection === sections[5].id}
                        onClick={() => setActiveSection(activeSection === sections[5].id ? null : sections[5].id)}
                        deviceType={deviceType}
                        fullWidth={true}
                      />
                    </div>
                    <div className="w-full lg:w-1/2">
                      <PolicyCard
                        icon={sections[6].icon}
                        title={sections[6].title}
                        content={sections[6].content}
                        delay={0.7}
                        isActive={activeSection === sections[6].id}
                        onClick={() => setActiveSection(activeSection === sections[6].id ? null : sections[6].id)}
                        deviceType={deviceType}
                        fullWidth={true}
                      />
                    </div>
                  </motion.div>

                  {/* Cinquième rangée : Modifications et Contact */}
                  <motion.div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2">
                      <PolicyCard
                        icon={sections[7].icon}
                        title={sections[7].title}
                        content={sections[7].content}
                        delay={0.8}
                        isActive={activeSection === sections[7].id}
                        onClick={() => setActiveSection(activeSection === sections[7].id ? null : sections[7].id)}
                        deviceType={deviceType}
                        fullWidth={true}
                      />
                    </div>
                    <div className="w-full lg:w-1/2">
                      <PolicyCard
                        icon={sections[8].icon}
                        title={sections[8].title}
                        content={sections[8].content}
                        delay={0.9}
                        isActive={activeSection === sections[8].id}
                        onClick={() => setActiveSection(activeSection === sections[8].id ? null : sections[8].id)}
                        deviceType={deviceType}
                        fullWidth={true}
                      />
                    </div>
                  </motion.div>
                </>
              ) : (
                // Version mobile et tablette : affichage en colonne
                sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    className="w-full"
                  >
                    <PolicyCard
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
                ))
              )}
            </motion.div>

            {/* Date de mise à jour */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: deviceType === 'mobile' ? 0.3 : 0.5,
                delay: deviceType === 'mobile' ? 0.6 : 1.2
              }}
              className="text-center mt-8"
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

export default PrivacyPolicy;
