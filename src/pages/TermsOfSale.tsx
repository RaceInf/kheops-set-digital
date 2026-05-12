import React, { useEffect, useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, CreditCard, Truck, RotateCcw, Shield, HelpCircle, ScrollText, FileText, Scale, LucideIcon, CheckCircle, XCircle, Clock, Target, Cog, Rocket, ClipboardList, Receipt, Handshake, Wrench, Package, Gavel, AlertCircle, BookOpen } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Seo from '@/components/seo/Seo';

// FAQ items for the Terms of Sale page
const faqItems = [
  {
    question: "Comment puis-je payer mes achats ?",
    answer: "Nous acceptons plusieurs méthodes de paiement, notamment par carte bancaire, mobile money, et virement bancaire. Tous les paiements sont sécurisés."
  },
  {
    question: "Quelle est la politique de remboursement pour les ebooks ?",
    answer: "En raison de la nature numérique de nos produits, les ebooks ne sont pas remboursables une fois téléchargés. Cependant, si vous rencontrez des problèmes techniques, veuillez nous contacter."
  },
  {
    question: "Les prix affichés incluent-ils la TVA ?",
    answer: "Oui, tous les prix affichés sur notre site incluent la TVA applicable."
  },
  {
    question: "Combien de temps ai-je accès aux ebooks après l'achat ?",
    answer: "Une fois achetés, vous avez un accès illimité dans le temps à vos ebooks."
  },
  {
    question: "Puis-je partager mes ebooks avec d'autres personnes ?",
    answer: "Non, nos ebooks sont protégés par des droits d'auteur et sont destinés à un usage personnel uniquement."
  }
];

interface FeatureItemProps {
  icon: LucideIcon;
  text: string;
}

// Feature item component
const FeatureItem = ({ icon: Icon, text }: FeatureItemProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center text-center"
  >
    <Icon className="text-kheops-salmon mb-2" size={24} />
    <p className="text-xs md:text-sm font-medium">{text}</p>
  </motion.div>
);

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
const TermsCard = ({ 
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

const TermsOfSale = () => {
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
      icon: BookOpen,
      title: "Introduction",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Les présentes conditions générales de vente (CGV) définissent les droits et obligations de KHEOPS SET DIGITAL et de ses clients dans le cadre de la vente de produits et services digitaux. Veuillez les lire attentivement avant tout achat.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-kheops-gold/10 to-kheops-salmon/10 p-4 rounded-xl">
              <ShoppingBag className="text-kheops-gold mb-2" size={24} />
              <h4 className="font-semibold mb-1">Commande</h4>
              <p className="text-sm text-gray-600">Processus d'achat simple et sécurisé</p>
            </div>
            <div className="bg-gradient-to-br from-kheops-gold/10 to-kheops-salmon/10 p-4 rounded-xl">
              <CreditCard className="text-kheops-gold mb-2" size={24} />
              <h4 className="font-semibold mb-1">Prix</h4>
              <p className="text-sm text-gray-600">Tarifs transparents en FCFA, EUR ou USD</p>
            </div>
            <div className="bg-gradient-to-br from-kheops-gold/10 to-kheops-salmon/10 p-4 rounded-xl">
              <Shield className="text-kheops-gold mb-2" size={24} />
              <h4 className="font-semibold mb-1">Garanties</h4>
              <p className="text-sm text-gray-600">Protection et confidentialité assurées</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "preambule",
      icon: ClipboardList,
      title: "Préambule",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Les présentes CGV sont conclues entre la société KHEOPS SET DIGITAL, SARL au capital de 1 000 000 FCFA, immatriculée au RC/DLA/2022/B/05678, NIF M092345678912305678, dont le siège social est situé à Logpom, Douala, Cameroun (ci-après "KHEOPS SET DIGITAL") et toute personne physique ou morale souhaitant procéder à un achat via le site Internet{" "}
            <a 
              href="https://kheopsetdigital.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-kheops-gold hover:text-kheops-salmon transition-colors"
            >
              kheopsetdigital.com
            </a>
            {" "}(ci-après "le Client").
          </p>
        </div>
      ),
    },
    {
      id: "produits",
      icon: ShoppingBag,
      title: "Produits et services",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            KHEOPS SET DIGITAL propose les services suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-600 leading-relaxed">Stratégie Digitale (audit, plan d'action, KPIs, formation)</li>
            <li className="text-gray-600 leading-relaxed">Création Web (sites vitrine, e-commerce, développement, maintenance)</li>
            <li className="text-gray-600 leading-relaxed">Marketing Digital (réseaux sociaux, publicité, SEO, content marketing)</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            Les offres sont valables tant qu'elles sont visibles sur le site. KHEOPS SET DIGITAL se réserve le droit de modifier son offre de services à tout moment.
          </p>
        </div>
      ),
    },
    {
      id: "prix",
      icon: Receipt,
      title: "Prix",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Les prix sont indiqués en FCFA (XAF), Euros (EUR) ou Dollars Américains (USD) toutes taxes comprises (TVA 20% pour les transactions au Cameroun). Les tarifs sont les suivants à titre indicatif :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-600 leading-relaxed">Création Web : À partir de 105 000 FCFA / 160 € / 175 $</li>
            <li className="text-gray-600 leading-relaxed">Marketing Digital : À partir de 90 000 FCFA / 138 € / 150 $/mois</li>
            <li className="text-gray-600 leading-relaxed">Stratégie Digitale : Sur devis</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            Les prix sont valables au moment de la commande. KHEOPS SET DIGITAL se réserve le droit de modifier ses tarifs à tout moment.
          </p>
        </div>
      ),
    },
    {
      id: "commande",
      icon: Handshake,
      title: "Processus de Commande",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Notre processus de commande est conçu pour être simple, transparent et efficace. Voici les étapes clés :
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Étape 1 */}
            <div className="bg-white rounded-lg border border-kheops-gold/10 p-4 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-kheops-gold to-kheops-salmon flex items-center justify-center text-white">
                  <Target size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-kheops-gold mb-1">1. Expression des besoins</h4>
                  <p className="text-sm text-gray-600">
                    Le client détaille ses besoins via un brief ou lors d'un entretien.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-kheops-gold/5 text-kheops-gold rounded text-xs">Brief</span>
                    <span className="px-2 py-0.5 bg-kheops-gold/5 text-kheops-gold rounded text-xs">Entretien</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="bg-white rounded-lg border border-kheops-gold/10 p-4 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-kheops-gold to-kheops-salmon flex items-center justify-center text-white">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-kheops-gold mb-1">2. Proposition commerciale</h4>
                  <p className="text-sm text-gray-600">
                    KHEOPS SET DIGITAL établit un devis détaillé des prestations.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-kheops-gold/5 text-kheops-gold rounded text-xs">Devis</span>
                    <span className="px-2 py-0.5 bg-kheops-gold/5 text-kheops-gold rounded text-xs">Planning</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="bg-white rounded-lg border border-kheops-gold/10 p-4 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-kheops-gold to-kheops-salmon flex items-center justify-center text-white">
                  <CheckCircle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-kheops-gold mb-1">3. Validation</h4>
                  <p className="text-sm text-gray-600">
                    Le client valide la proposition et verse l'acompte convenu.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-kheops-gold/5 text-kheops-gold rounded text-xs">Validation</span>
                    <span className="px-2 py-0.5 bg-kheops-gold/5 text-kheops-gold rounded text-xs">Acompte</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 4 */}
            <div className="bg-white rounded-lg border border-kheops-gold/10 p-4 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-kheops-gold to-kheops-salmon flex items-center justify-center text-white">
                  <Cog size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-kheops-gold mb-1">4. Réalisation</h4>
                  <p className="text-sm text-gray-600">
                    Exécution des prestations selon le planning établi.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-kheops-gold/5 text-kheops-gold rounded text-xs">Suivi</span>
                    <span className="px-2 py-0.5 bg-kheops-gold/5 text-kheops-gold rounded text-xs">Qualité</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 5 */}
            <div className="bg-white rounded-lg border border-kheops-gold/10 p-4 hover:shadow-md transition-all md:col-span-2">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-kheops-gold to-kheops-salmon flex items-center justify-center text-white">
                  <Rocket size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-kheops-gold mb-1">5. Livraison</h4>
                  <p className="text-sm text-gray-600">
                    Remise des livrables et validation finale du projet.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-kheops-gold/5 text-kheops-gold rounded text-xs">Livraison</span>
                    <span className="px-2 py-0.5 bg-kheops-gold/5 text-kheops-gold rounded text-xs">Validation</span>
                    <span className="px-2 py-0.5 bg-kheops-gold/5 text-kheops-gold rounded text-xs">Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note de bas de page */}
          <div className="mt-4 p-3 bg-kheops-gold/5 rounded-lg border border-kheops-gold/10">
            <p className="text-xs text-gray-600 italic">
              Chaque étape est accompagnée d'une communication claire et transparente. Notre équipe reste à votre disposition pour toute question.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "delais",
      icon: Clock,
      title: "Délais",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Les délais de livraison sont définis dans la proposition commerciale et sont donnés à titre indicatif. Ils peuvent varier selon la complexité du projet et les spécificités de chaque mission.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-kheops-gold mb-2">Facteurs pouvant affecter les délais :</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li className="text-gray-600">Délais de validation client</li>
              <li className="text-gray-600">Demandes de modifications</li>
              <li className="text-gray-600">Cas de force majeure</li>
              <li className="text-gray-600">Complexité technique du projet</li>
              <li className="text-gray-600">Disponibilité des ressources</li>
            </ul>
            <p className="text-gray-600 mt-2 text-sm italic">
              Les retards liés à ces facteurs ne peuvent engager notre responsabilité.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "garanties",
      icon: Shield,
      title: "Garanties",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Garanties incluses</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li className="text-gray-600 leading-relaxed">Conformité aux spécifications techniques</li>
              <li className="text-gray-600 leading-relaxed">Support technique (2 mois après livraison)</li>
              <li className="text-gray-600 leading-relaxed">Correction des bugs et dysfonctionnements</li>
              <li className="text-gray-600 leading-relaxed">Sauvegarde et sécurité des données</li>
              <li className="text-gray-600 leading-relaxed">Formation à l'utilisation des outils</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Limites de garantie</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li className="text-gray-600 leading-relaxed">Utilisation non conforme aux spécifications</li>
              <li className="text-gray-600 leading-relaxed">Modifications effectuées par des tiers</li>
              <li className="text-gray-600 leading-relaxed">Cas de force majeure</li>
              <li className="text-gray-600 leading-relaxed">Pertes d'exploitation ou dommages indirects</li>
              <li className="text-gray-600 leading-relaxed">Non-respect des conditions d'utilisation</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-kheops-gold mb-2">Durée des garanties</h4>
            <p className="text-gray-600 leading-relaxed">
              Les garanties s'appliquent pendant une période de 2 mois à compter de la livraison finale du projet. Cette période peut être étendue selon les termes spécifiques de la proposition commerciale.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "paiement",
      icon: CreditCard,
      title: "Modalités de paiement",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Conditions de paiement</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li className="text-gray-600 leading-relaxed">70% du montant total à la commande</li>
              <li className="text-gray-600 leading-relaxed">30% du solde à la livraison</li>
              <li className="text-gray-600 leading-relaxed">Délai de paiement : 30 jours après réception de la facture</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Moyens de paiement acceptés</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li className="text-gray-600 leading-relaxed">Mobile Money (Orange Money, MTN Mobile Money)</li>
              <li className="text-gray-600 leading-relaxed">Cartes bancaires (Visa, Mastercard)</li>
              <li className="text-gray-600 leading-relaxed">Western Union</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 leading-relaxed">
              Les prix sont indiqués en FCFA (XAF), Euros (EUR) ou Dollars Américains (USD) toutes taxes comprises (TVA 20% pour les transactions au Cameroun). Pour les services numériques, le droit de rétractation ne s'applique pas une fois la prestation commencée avec l'accord du client. Le taux de change appliqué est celui en vigueur au moment de la commande.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "confidentialite",
      icon: AlertCircle,
      title: "Confidentialité",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Engagement de confidentialité</h4>
            <p className="text-gray-600 leading-relaxed">
              Protection des informations confidentielles échangées pendant et 5 ans après le contrat.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Données personnelles</h4>
            <p className="text-gray-600 leading-relaxed">
              Traitement conforme au RGPD.
            </p>
            <a href="/politique-de-confidentialite" className="text-kheops-gold hover:text-kheops-salmon transition-colors">
              En savoir plus
            </a>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Sous-traitants</h4>
            <p className="text-gray-600 leading-relaxed">
              Engagement de confidentialité étendu aux sous-traitants.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-kheops-gold mb-2">Mesures de protection</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li className="text-gray-600 leading-relaxed">Accès restreint aux données sensibles</li>
              <li className="text-gray-600 leading-relaxed">Protocoles de sécurité renforcés</li>
              <li className="text-gray-600 leading-relaxed">Formation du personnel à la confidentialité</li>
              <li className="text-gray-600 leading-relaxed">Audits réguliers des systèmes</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "propriete",
      icon: Gavel,
      title: "Propriété Intellectuelle",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Droits d'auteur</h4>
            <p className="text-gray-600 leading-relaxed">
              KHEOPS SET DIGITAL reste propriétaire des droits d'auteur sur les créations jusqu'au paiement intégral.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li className="text-gray-600 leading-relaxed">Codes sources</li>
              <li className="text-gray-600 leading-relaxed">Designs graphiques</li>
              <li className="text-gray-600 leading-relaxed">Contenus créatifs</li>
              <li className="text-gray-600 leading-relaxed">Documents techniques</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Cession des droits</h4>
            <p className="text-gray-600 leading-relaxed">
              Après paiement complet, le client reçoit une licence d'utilisation exclusive.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li className="text-gray-600 leading-relaxed">Droit d'utilisation</li>
              <li className="text-gray-600 leading-relaxed">Droit de modification</li>
              <li className="text-gray-600 leading-relaxed">Droit de reproduction</li>
              <li className="text-gray-600 leading-relaxed">Droit de distribution</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-kheops-gold mb-2">Conditions de cession</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li className="text-gray-600 leading-relaxed">Paiement intégral des sommes dues</li>
              <li className="text-gray-600 leading-relaxed">Respect des conditions d'utilisation</li>
              <li className="text-gray-600 leading-relaxed">Non-cession à des tiers sans autorisation</li>
              <li className="text-gray-600 leading-relaxed">Mention des droits d'auteur</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "resiliation",
      icon: RotateCcw,
      title: "Résiliation du contrat",
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Le contrat peut être résilié selon les modalités suivantes :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2">Résiliation par le client</h4>
              <p className="text-gray-600 mb-2">30 jours de préavis</p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li className="text-gray-600">Indemnité de 10% du montant restant dû</li>
                <li className="text-gray-600">Préavis de 30 jours à respecter</li>
                <li className="text-gray-600">Remboursement éventuel selon l'avancement des travaux</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-700 mb-2">Résiliation par KHEOPS</h4>
              <p className="text-gray-600 mb-2">15 jours après mise en demeure</p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li className="text-gray-600">En cas de non-paiement</li>
                <li className="text-gray-600">Non-respect des obligations contractuelles</li>
                <li className="text-gray-600">Après mise en demeure restée sans effet</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-700 mb-2">Cas de force majeure</h4>
              <p className="text-gray-600 mb-2">Effet immédiat</p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li className="text-gray-600">Événements imprévisibles et irrésistibles</li>
                <li className="text-gray-600">Durée supérieure à 2 mois</li>
                <li className="text-gray-600">Aucune indemnité due</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-kheops-gold mb-2">Conséquences de la résiliation :</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li className="text-gray-600 leading-relaxed">Remboursement des sommes versées pour les prestations non réalisées</li>
              <li className="text-gray-600 leading-relaxed">Restauration des parties dans leur état antérieur si nécessaire</li>
              <li className="text-gray-600 leading-relaxed">Confidentialité maintenue sur les informations échangées</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "litiges",
      icon: Scale,
      title: "Litiges",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-kheops-gold/5 to-kheops-salmon/5 p-4 rounded-xl">
              <h4 className="font-semibold text-kheops-gold mb-2">Droit applicable</h4>
              <p className="text-gray-600">Droit camerounais</p>
            </div>
            <div className="bg-gradient-to-br from-kheops-gold/5 to-kheops-salmon/5 p-4 rounded-xl">
              <h4 className="font-semibold text-kheops-gold mb-2">Juridiction compétente</h4>
              <p className="text-gray-600">Tribunal de Première Instance de Douala</p>
            </div>
            <div className="bg-gradient-to-br from-kheops-gold/5 to-kheops-salmon/5 p-4 rounded-xl">
              <h4 className="font-semibold text-kheops-gold mb-2">Médiation</h4>
              <p className="text-gray-600">Tentative de règlement amiable obligatoire</p>
            </div>
            <div className="bg-gradient-to-br from-kheops-gold/5 to-kheops-salmon/5 p-4 rounded-xl">
              <h4 className="font-semibold text-kheops-gold mb-2">Délai de prescription</h4>
              <p className="text-gray-600">10 ans</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-kheops-gold mb-2">Procédure de résolution des litiges</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li className="text-gray-600 leading-relaxed">Tentative de résolution amiable entre les parties</li>
              <li className="text-gray-600 leading-relaxed">Médiation par un tiers indépendant</li>
              <li className="text-gray-600 leading-relaxed">Recours aux tribunaux compétents</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "faq",
      icon: HelpCircle,
      title: "Questions fréquentes",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Quels sont les délais de livraison des prestations ?</h4>
            <p className="text-gray-600 leading-relaxed">
              Les délais de livraison sont définis dans la proposition commerciale et peuvent varier selon la complexité du projet. Ils sont donnés à titre indicatif et peuvent être affectés par les délais de validation client, les demandes de modifications ou les cas de force majeure.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Quelle est la politique de confidentialité ?</h4>
            <p className="text-gray-600 leading-relaxed">
              Nous nous engageons à protéger la confidentialité des informations échangées pendant et 5 ans après le contrat. Le traitement des données personnelles est conforme au RGPD. Pour plus de détails, consultez notre politique de confidentialité.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Comment se passe le processus de résiliation ?</h4>
            <p className="text-gray-600 leading-relaxed">
              Le client peut résilier le contrat avec un préavis de 30 jours, moyennant une indemnité de 10% du montant restant dû. KHEOPS SET DIGITAL peut résilier le contrat après 15 jours de mise en demeure en cas de non-paiement ou de non-respect des obligations contractuelles.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Quels sont les modes de paiement acceptés ?</h4>
            <p className="text-gray-600 leading-relaxed">
              Nous acceptons les paiements par Mobile Money (Orange Money, MTN Mobile Money), cartes bancaires (Visa, Mastercard) et Western Union. Le paiement se fait à 70% à la commande et 30% à la livraison.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-kheops-gold">Quelle est la politique de propriété intellectuelle ?</h4>
            <p className="text-gray-600 leading-relaxed">
              KHEOPS SET DIGITAL reste propriétaire des droits d'auteur jusqu'au paiement intégral. Après paiement complet, le client reçoit une licence d'utilisation exclusive incluant les droits d'utilisation, de modification, de reproduction et de distribution.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Seo page="conditions-generales-de-vente" />
      <Helmet>
        <title>Conditions Générales de Vente | KHEOPS SET DIGITAL - CGV</title>
        <meta name="description" content="Consultez nos conditions générales de vente (CGV) : modalités d'achat, livraison, paiement, garanties et droits des clients pour nos services digitaux au Cameroun." />
        <meta name="keywords" content="CGV, conditions générales de vente, achat, livraison, paiement, garanties, droits clients, services digitaux, Cameroun" />
        <link rel="canonical" href="https://kheopsetdigital.com/conditions-generales-de-vente" />
        <meta name="publisher" content="KHEOPS SET DIGITAL" />
        <meta property="og:title" content="Conditions Générales de Vente | KHEOPS SET DIGITAL" />
        <meta property="og:description" content="Consultez nos conditions générales de vente (CGV) : modalités d'achat, livraison, paiement, garanties et droits des clients pour nos services digitaux au Cameroun." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kheopsetdigital.com/conditions-generales-de-vente" />
        <meta property="og:image" content="https://kheopsetdigital.com/images/og/terms.jpg" />
        <meta property="og:image:alt" content="Conditions Générales de Vente KHEOPS SET DIGITAL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Conditions Générales de Vente | KHEOPS SET DIGITAL" />
        <meta name="twitter:description" content="Consultez nos conditions générales de vente (CGV) : modalités d'achat, livraison, paiement, garanties et droits des clients pour nos services digitaux au Cameroun." />
        <meta name="twitter:image" content="https://kheopsetdigital.com/images/og/terms.jpg" />
        <meta name="twitter:image:alt" content="Conditions Générales de Vente KHEOPS SET DIGITAL" />
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
                  Conditions Générales de Vente
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
                Nos engagements pour une collaboration claire et juste.
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
                    <TermsCard
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

                  {/* Deuxième rangée : Préambule et Produits */}
                  <motion.div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2">
                      <TermsCard
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
                      <TermsCard
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

                  {/* Troisième rangée : Prix et Commande */}
                  <motion.div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2">
                      <TermsCard
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
                      <TermsCard
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

                  {/* Quatrième rangée : Délais et Garanties */}
                  <motion.div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2">
                      <TermsCard
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
                      <TermsCard
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

                  {/* Cinquième rangée : Paiement et Confidentialité */}
                  <motion.div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2">
                      <TermsCard
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
                      <TermsCard
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

                  {/* Sixième rangée : Propriété Intellectuelle et Résiliation */}
                  <motion.div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2">
                      <TermsCard
                        icon={sections[9].icon}
                        title={sections[9].title}
                        content={sections[9].content}
                        delay={1.0}
                        isActive={activeSection === sections[9].id}
                        onClick={() => setActiveSection(activeSection === sections[9].id ? null : sections[9].id)}
                        deviceType={deviceType}
                        fullWidth={true}
                      />
                    </div>
                    <div className="w-full lg:w-1/2">
                      <TermsCard
                        icon={sections[10].icon}
                        title={sections[10].title}
                        content={sections[10].content}
                        delay={1.1}
                        isActive={activeSection === sections[10].id}
                        onClick={() => setActiveSection(activeSection === sections[10].id ? null : sections[10].id)}
                        deviceType={deviceType}
                        fullWidth={true}
                      />
                    </div>
                  </motion.div>

                  {/* Septième rangée : Litiges et FAQ */}
                  <motion.div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2">
                      <TermsCard
                        icon={sections[11].icon}
                        title={sections[11].title}
                        content={sections[11].content}
                        delay={1.2}
                        isActive={activeSection === sections[11].id}
                        onClick={() => setActiveSection(activeSection === sections[11].id ? null : sections[11].id)}
                        deviceType={deviceType}
                        fullWidth={true}
                      />
                    </div>
                    <div className="w-full lg:w-1/2">
                      <TermsCard
                        icon={sections[12].icon}
                        title={sections[12].title}
                        content={sections[12].content}
                        delay={1.3}
                        isActive={activeSection === sections[12].id}
                        onClick={() => setActiveSection(activeSection === sections[12].id ? null : sections[12].id)}
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
                    <TermsCard
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

export default TermsOfSale;
