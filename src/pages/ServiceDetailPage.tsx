import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Check, ArrowRight, ChevronRight, ChevronDown, HelpCircle, Users, Search, BarChart2, Smartphone, Mail, TrendingUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { StatsSection } from "@/components/sections/StatsSection";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

interface ServiceInfo {
  id: string;
  title: string;
  icon: JSX.Element;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  features: string[];
  process: {
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  image: string;
}

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  // Define all services here
  const services: Record<string, ServiceInfo> = {
    "community-management": {
      id: "community-management",
      title: "Community Management",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>,
      shortDescription: "Stratégies ciblées pour renforcer votre présence sur les réseaux sociaux et engager votre audience de manière authentique.",
      longDescription: "Le community management est au cœur de votre stratégie digitale. Chez KHEOPS SET DIGITAL, nous créons et gérons votre présence en ligne pour établir une relation forte avec votre communauté. Notre approche personnalisée stimule l'engagement, renforce votre image de marque et transforme vos abonnés en clients fidèles.",
      benefits: [
        "Augmentation de la visibilité de votre marque",
        "Création d'une communauté engagée et fidèle",
        "Gestion professionnelle de votre réputation en ligne",
        "Analyse régulière des performances pour optimiser la stratégie"
      ],
      features: [
        "Audit et analyse de votre présence actuelle sur les réseaux sociaux",
        "Définition d'une stratégie éditoriale sur mesure",
        "Création et planification de contenus engageants",
        "Animation quotidienne de vos réseaux sociaux",
        "Modération et interaction avec votre communauté",
        "Veille concurrentielle et benchmarking",
        "Reporting mensuel détaillé"
      ],
      process: [
        {
          title: "Analyse",
          description: "Nous étudions votre marque, vos objectifs, votre cible et votre positionnement actuel sur les réseaux sociaux."
        },
        {
          title: "Stratégie",
          description: "Nous élaborons une stratégie éditoriale alignée avec vos objectifs commerciaux et votre identité de marque."
        },
        {
          title: "Création",
          description: "Nous produisons des contenus de qualité adaptés à chaque plateforme pour maximiser l'engagement."
        },
        {
          title: "Animation",
          description: "Nous gérons vos comptes au quotidien en créant une véritable relation avec votre communauté."
        }
      ],
      faqs: [
        {
          question: "Sur quels réseaux sociaux intervenez-vous ?",
          answer: "Nous intervenons sur tous les réseaux sociaux pertinents pour votre activité : Facebook, Instagram, LinkedIn, Twitter, TikTok, Pinterest, et YouTube."
        },
        {
          question: "Quelle est la fréquence de publication recommandée ?",
          answer: "La fréquence optimale dépend de votre secteur et de vos objectifs, mais nous recommandons généralement 3 à 5 publications par semaine pour maintenir une présence active."
        },
        {
          question: "Comment mesurez-vous les résultats ?",
          answer: "Nous utilisons des outils d'analyse performants pour suivre l'évolution de votre communauté, l'engagement, la portée et la conversion. Un rapport mensuel détaillé vous est remis."
        }
      ],
      image: "/images/services/community-management.jpg"
    },
    "creation-sites-web": {
      id: "creation-sites-web",
      title: "Création de Sites Web",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
      shortDescription: "Sites vitrines et e-commerce modernes, responsives et optimisés pour convertir les visiteurs en clients.",
      longDescription: "Un site web performant est essentiel pour établir votre présence en ligne et développer votre activité. Chez KHEOPS SET DIGITAL, nous concevons des sites web sur mesure qui reflètent l'identité de votre marque, optimisés pour les moteurs de recherche et conçus pour offrir une expérience utilisateur exceptionnelle. Qu'il s'agisse d'un site vitrine élégant ou d'une boutique e-commerce complète, nous créons des plateformes web qui convertissent les visiteurs en clients.",
      benefits: [
        "Site web professionnel reflétant l'identité de votre marque",
        "Expérience utilisateur optimisée pour maximiser les conversions",
        "Compatibilité parfaite sur tous les appareils (responsive design)",
        "Référencement naturel optimisé pour améliorer votre visibilité"
      ],
      features: [
        "Design sur mesure adapté à votre identité visuelle",
        "Intégration de CMS pour une gestion autonome du contenu",
        "Optimisation pour les moteurs de recherche (SEO)",
        "Compatible tous appareils (desktop, tablette, mobile)",
        "Intégration d'outils d'analyse et de suivi",
        "Modules e-commerce sécurisés (si applicable)",
        "Maintenance et support technique"
      ],
      process: [
        {
          title: "Briefing",
          description: "Nous définissons ensemble vos objectifs, vos besoins et vos attentes pour votre site web."
        },
        {
          title: "Conception",
          description: "Nous élaborons une maquette graphique pour visualiser l'apparence de votre futur site."
        },
        {
          title: "Développement",
          description: "Nous développons votre site avec les technologies adaptées à vos besoins spécifiques."
        },
        {
          title: "Tests et optimisation",
          description: "Nous testons votre site sur différents appareils et optimisons ses performances."
        }
      ],
      faqs: [
        {
          question: "Combien de temps faut-il pour créer un site web ?",
          answer: "Le délai varie selon la complexité du projet, mais comptez généralement 4 à 8 semaines pour un site vitrine et 8 à 12 semaines pour un site e-commerce."
        },
        {
          question: "Puis-je modifier moi-même le contenu de mon site ?",
          answer: "Oui, nous intégrons des systèmes de gestion de contenu (CMS) qui vous permettent de mettre à jour facilement votre site sans connaissances techniques."
        },
        {
          question: "Le site sera-t-il optimisé pour le référencement ?",
          answer: "Absolument. Nous appliquons les meilleures pratiques SEO dès la conception pour favoriser votre positionnement dans les résultats de recherche."
        }
      ],
      image: "/images/services/site-web.jpg"
    },
    "identite-visuelle": {
      id: "identite-visuelle",
      title: "Identité Visuelle",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"></path><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="m2 2 7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>,
      shortDescription: "Logos, chartes graphiques et supports visuels qui reflètent l'unicité de votre marque et marquent les esprits.",
      longDescription: "Votre identité visuelle est le visage de votre entreprise. Elle doit refléter votre personnalité, vos valeurs et se démarquer dans un marché compétitif. Chez KHEOPS SET DIGITAL, nous concevons des identités visuelles mémorables qui racontent votre histoire et créent une connexion émotionnelle avec votre public. Du logo aux supports de communication, nous créons un univers graphique cohérent qui renforce votre image de marque à chaque point de contact.",
      benefits: [
        "Différenciation forte face à la concurrence",
        "Cohérence visuelle sur tous vos supports de communication",
        "Renforcement de la mémorisation de votre marque",
        "Image professionnelle inspirant confiance"
      ],
      features: [
        "Création de logo unique et mémorable",
        "Développement d'une charte graphique complète",
        "Définition de la palette de couleurs et typographies",
        "Création de modèles pour vos supports de communication",
        "Design d'éléments graphiques personnalisés",
        "Adaptation de votre identité à tous les formats",
        "Guide d'utilisation de votre identité visuelle"
      ],
      process: [
        {
          title: "Découverte",
          description: "Nous explorons votre univers, vos valeurs et vos objectifs pour comprendre l'essence de votre marque."
        },
        {
          title: "Recherche",
          description: "Nous étudions votre secteur, votre concurrence et les tendances pour positionner votre identité."
        },
        {
          title: "Création",
          description: "Nous développons plusieurs concepts créatifs avant d'affiner la direction choisie."
        },
        {
          title: "Finalisation",
          description: "Nous peaufinons tous les éléments et préparons votre kit d'identité visuelle complet."
        }
      ],
      faqs: [
        {
          question: "Ai-je besoin d'une identité visuelle complète ou juste d'un logo ?",
          answer: "Bien qu'un logo soit un bon point de départ, une identité visuelle complète assure la cohérence de votre marque sur tous les supports et renforce sa reconnaissance."
        },
        {
          question: "Comment se déroule le processus de création de logo ?",
          answer: "Après un briefing détaillé, nous développons plusieurs concepts que nous vous présentons. Suite à vos retours, nous affinons la proposition choisie jusqu'à obtenir le résultat final."
        },
        {
          question: "Que contient une charte graphique complète ?",
          answer: "Elle inclut généralement votre logo et ses variantes, votre palette de couleurs, vos typographies, vos éléments graphiques, et des directives d'utilisation pour divers supports."
        }
      ],
      image: "/images/services/identite-visuelle.jpg"
    },
    "strategie-digitale": {
      id: "strategie-digitale",
      title: "Stratégie Digitale",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"></line><line x1="12" x2="12" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="14"></line></svg>,
      shortDescription: "Élaboration de feuilles de route digitales complètes pour atteindre vos objectifs commerciaux.",
      longDescription: "Une stratégie digitale efficace est le fondement de votre succès en ligne. Chez KHEOPS SET DIGITAL, nous développons des plans d'action personnalisés qui alignent vos activités numériques avec vos objectifs commerciaux. De l'analyse de votre écosystème digital à la mise en œuvre d'actions cohérentes, nous vous guidons pour maximiser votre impact en ligne et obtenir des résultats concrets.",
      benefits: [
        "Vision claire et cohérente de votre présence digitale",
        "Optimisation de votre investissement marketing",
        "Augmentation mesurable de votre visibilité en ligne",
        "Amélioration continue basée sur l'analyse de données"
      ],
      features: [
        "Audit complet de votre présence digitale actuelle",
        "Analyse de votre marché et de votre concurrence",
        "Définition d'objectifs SMART et d'indicateurs de performance",
        "Élaboration d'un plan d'action personnalisé",
        "Recommandations sur les canaux et tactiques à privilégier",
        "Planification budgétaire et calendrier d'actions",
        "Suivi et optimisation continue"
      ],
      process: [
        {
          title: "Diagnostic",
          description: "Nous analysons votre présence digitale actuelle, votre positionnement et les opportunités de votre marché."
        },
        {
          title: "Élaboration",
          description: "Nous définissons une stratégie adaptée à vos objectifs et au comportement de votre cible."
        },
        {
          title: "Déploiement",
          description: "Nous mettons en œuvre les actions définies selon le calendrier établi."
        },
        {
          title: "Mesure",
          description: "Nous suivons les performances, analysons les résultats et ajustons la stratégie en conséquence."
        }
      ],
      faqs: [
        {
          question: "Pourquoi ai-je besoin d'une stratégie digitale ?",
          answer: "Une stratégie digitale donne une direction claire à vos actions en ligne, évite les dépenses inutiles et maximise l'impact de vos efforts marketing pour atteindre vos objectifs commerciaux."
        },
        {
          question: "Quelle est la durée typique d'une stratégie digitale ?",
          answer: "Nous recommandons généralement une vision à 12 mois, avec des révisions trimestrielles pour s'adapter aux évolutions du marché et aux résultats obtenus."
        },
        {
          question: "Comment mesure-t-on l'efficacité de la stratégie ?",
          answer: "Nous définissons des KPIs (indicateurs clés de performance) spécifiques à vos objectifs et utilisons des outils d'analyse pour suivre votre progression et mesurer le ROI."
        }
      ],
      image: "/images/services/strategie-digitale.jpg"
    },
    "social-media-marketing": {
      id: "social-media-marketing",
      title: "Social Media Marketing",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 11h.01"></path><path d="M7 11h.01"></path><path d="M12 18c3.5 0 6-2 6-5v-1a2 2 0 1 0 0-4h-1V6a3 3 0 0 0-3-3c-1.66 0-3 1-3.24 2.5C8.44 5.84 6.88 7 6 7H5a2 2 0 1 0 0 4v1c0 3 2.5 5 6 5Z"></path><path d="M5 8v5c0 1 0 5 7 5s7-4 7-5V8"></path></svg>,
      shortDescription: "Campagnes publicitaires ciblées sur les réseaux sociaux pour augmenter votre visibilité et vos conversions.",
      longDescription: "Le Social Media Marketing va au-delà de la simple présence sur les réseaux sociaux. Chez KHEOPS SET DIGITAL, nous concevons et gérons des campagnes publicitaires hautement ciblées qui atteignent votre audience idéale au moment opportun. Notre expertise en publicité sur les réseaux sociaux vous permet d'augmenter votre visibilité, d'attirer du trafic qualifié et de générer des conversions mesurables, tout en optimisant votre budget publicitaire.",
      benefits: [
        "Ciblage précis de votre audience idéale",
        "Augmentation rapide de votre visibilité",
        "Génération de leads et conversions mesurables",
        "Optimisation continue pour maximiser votre ROI"
      ],
      features: [
        "Définition précise des personas et segments cibles",
        "Création de campagnes sur mesure pour chaque plateforme",
        "Conception de visuels et messages publicitaires impactants",
        "Paramétrage avancé du ciblage publicitaire",
        "Tests A/B pour optimiser les performances",
        "Suivi en temps réel et ajustements stratégiques",
        "Analyse détaillée des résultats et reporting"
      ],
      process: [
        {
          title: "Stratégie",
          description: "Nous définissons les objectifs, cibles et messages clés de vos campagnes publicitaires."
        },
        {
          title: "Création",
          description: "Nous développons des annonces créatives et persuasives adaptées à chaque plateforme."
        },
        {
          title: "Diffusion",
          description: "Nous lançons vos campagnes avec un ciblage précis et une optimisation budgétaire."
        },
        {
          title: "Optimisation",
          description: "Nous analysons les performances en temps réel et ajustons les paramètres pour maximiser les résultats."
        }
      ],
      faqs: [
        {
          question: "Sur quelles plateformes proposez-vous des campagnes publicitaires ?",
          answer: "Nous gérons des campagnes sur Facebook, Instagram, LinkedIn, Twitter, TikTok, Pinterest et YouTube, en fonction de votre audience cible et de vos objectifs."
        },
        {
          question: "Quel budget minimum recommandez-vous pour les publicités sur les réseaux sociaux ?",
          answer: "Le budget minimum dépend de vos objectifs, mais nous recommandons généralement de commencer avec au moins 500€ par mois pour obtenir des résultats significatifs."
        },
        {
          question: "Comment mesurez-vous le succès des campagnes ?",
          answer: "Nous mesurons le succès en fonction des objectifs définis : impressions, clics, engagement, leads, conversions, ou retour sur investissement (ROI)."
        }
      ],
      image: "/images/services/social-media.jpg"
    },
    "referencement-seo": {
      id: "referencement-seo",
      title: "Référencement SEO",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>,
      shortDescription: "Optimisation de votre visibilité sur les moteurs de recherche pour attirer un trafic qualifié sur votre site.",
      longDescription: "Le référencement naturel (SEO) est essentiel pour être visible auprès de prospects qui recherchent activement vos produits ou services. Chez KHEOPS SET DIGITAL, nous mettons en œuvre des stratégies SEO éprouvées pour améliorer votre positionnement dans les résultats des moteurs de recherche. Notre approche combine optimisation technique, stratégie de contenu et acquisition de liens pour générer un trafic qualifié et durable vers votre site web.",
      benefits: [
        "Visibilité accrue auprès d'une audience qualifiée",
        "Trafic organique durable et croissant",
        "Crédibilité et confiance renforcées",
        "Meilleur retour sur investissement à long terme"
      ],
      features: [
        "Audit SEO complet de votre site web",
        "Recherche et analyse de mots-clés stratégiques",
        "Optimisation on-page (structure, balises, contenu)",
        "Optimisation technique (vitesse, mobile, structure)",
        "Stratégie de contenu optimisé pour le SEO",
        "Acquisition de backlinks de qualité",
        "Suivi de positionnement et rapports mensuels"
      ],
      process: [
        {
          title: "Audit",
          description: "Nous analysons votre site actuel, vos mots-clés et votre positionnement par rapport à la concurrence."
        },
        {
          title: "Stratégie",
          description: "Nous élaborons un plan d'action SEO personnalisé basé sur les opportunités identifiées."
        },
        {
          title: "Optimisation",
          description: "Nous mettons en œuvre les améliorations techniques, structurelles et de contenu."
        },
        {
          title: "Suivi",
          description: "Nous surveillons vos positions, analysons les résultats et ajustons la stratégie en fonction."
        }
      ],
      faqs: [
        {
          question: "Combien de temps faut-il pour voir des résultats en SEO ?",
          answer: "Le SEO est un travail de fond qui demande du temps. Les premiers résultats sont généralement visibles après 3 à 6 mois, mais les effets les plus significatifs se produisent sur 6 à 12 mois."
        },
        {
          question: "Garantissez-vous la première position sur Google ?",
          answer: "Aucun professionnel sérieux ne peut garantir une position spécifique, car les algorithmes des moteurs de recherche évoluent constamment. Nous garantissons cependant l'application des meilleures pratiques et une amélioration progressive de votre visibilité."
        },
        {
          question: "Quelle est la différence entre SEO et SEA ?",
          answer: "Le SEO (référencement naturel) vise à améliorer votre positionnement dans les résultats de recherche organiques, tandis que le SEA (Search Engine Advertising) concerne les annonces payantes. Le SEO offre des résultats durables à long terme, tandis que le SEA génère du trafic immédiat mais s'arrête dès que vous cessez de payer."
        }
      ],
      image: "/images/services/referencement-seo.jpg"
    }
  };

  // Get the current service 
  const currentService = serviceId ? services[serviceId] : null;
  // State to keep track of which FAQ item is currently open (null = none)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    // Redirect if service doesn't exist
    if (serviceId && !services[serviceId]) {
      navigate('/services');
      return;
    }

    // Update page title
    if (currentService) {
      document.title = `${currentService.title} | KHEOPS SET DIGITAL`;
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }, [serviceId, navigate, currentService]);

  if (!currentService) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <meta property="og:image" content="https://i.ibb.co/ZpN8BsBF/Ordinateur.png" />
        <meta name="twitter:image" content="https://i.ibb.co/ZpN8BsBF/Ordinateur.png" />
      </Helmet>
      <Navbar />
      
      {/* Hero Section - Redesigned with a split layout */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="relative z-10"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                {currentService.title}
              </h1>
              <div className="w-20 h-1 bg-kheops-gold mb-6"></div>
              <p className="text-gray-700 text-lg mb-10 leading-relaxed">
                {currentService.longDescription}
              </p>
              {currentService.id === 'community-management' ? (
                <Button 
                  className="bg-kheops-gold hover:bg-kheops-salmon text-white px-8 py-6 rounded-md transition-all duration-300 text-lg flex items-center gap-2"
                  onClick={() => {
                    // Rediriger vers la page Services avec l'ancre
                    window.location.href = '/services#community-management-pricing';
                  }}
                >
                  Voir nos offres <ChevronRight size={18} />
                </Button>
              ) : (
                <Button 
                  className="bg-kheops-gold hover:bg-kheops-salmon text-white px-8 py-6 rounded-md transition-all duration-300 text-lg flex items-center gap-2"
                  onClick={() => window.location.href = '/contact'}
                >
                  Demander un devis <ChevronRight size={18} />
                </Button>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10 hidden lg:block"
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={currentService.image} 
                  alt={currentService.title} 
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-kheops-gold/20 mix-blend-multiply"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-kheops-gold rounded-full opacity-30 blur-xl"></div>
            </motion.div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-kheops-gold opacity-5 rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-kheops-salmon opacity-5 rounded-full"></div>
      </section>

      {/* Features Highlights Section - New */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que nous <span className="text-kheops-gold">proposons</span></h2>
              <div className="w-20 h-1 bg-kheops-gold mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Notre service de {currentService.title.toLowerCase()} offre une approche complète et stratégique pour répondre à tous vos besoins.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentService.features.slice(0, 6).map((feature, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 hover:border-kheops-gold/20"
                >
                  <div className="w-12 h-12 bg-kheops-gold/10 text-kheops-gold rounded-lg flex items-center justify-center mb-4">
                    <Check size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Redesigned with Cards + Icons */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Les <span className="text-kheops-gold">Avantages</span></h2>
              <div className="w-20 h-1 bg-kheops-gold mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Découvrez pourquoi notre service de {currentService.title.toLowerCase()} est la solution idéale pour votre entreprise.
              </p>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {currentService.benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeIn} 
                  className="flex items-start p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-kheops-gold text-white rounded-full flex items-center justify-center mr-4">
                    <Check size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{benefit}</h3>
                    <div className="w-12 h-1 bg-kheops-gold/30 mb-2"></div>
                    <p className="text-gray-600">
                      {index === 0 && "Amplifiez votre présence digitale et augmentez votre notoriété grâce à nos stratégies personnalisées."}
                      {index === 1 && "Développez une base de clients fidèles qui interagissent régulièrement avec votre marque et deviennent vos ambassadeurs."}
                      {index === 2 && "Maintenez une image professionnelle cohérente sur tous les canaux digitaux et gérez efficacement les commentaires."}
                      {index === 3 && "Bénéficiez d'un suivi régulier pour mesurer les résultats et ajuster votre stratégie en fonction des performances."}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section - Redesigned with Horizontal Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre <span className="text-kheops-gold">Processus</span></h2>
              <div className="w-20 h-1 bg-kheops-gold mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Une méthodologie éprouvée pour assurer le succès de vos projets de {currentService.title.toLowerCase()}.
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2 z-0"></div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {currentService.process.map((step, index) => (
                  <motion.div 
                    key={index} 
                    variants={fadeIn}
                    className="relative"
                  >
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full">
                      <div className="w-12 h-12 mx-auto bg-kheops-gold text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 md:mb-6">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-center text-gray-900">{step.title}</h3>
                      <p className="text-gray-600 text-center">{step.description}</p>
                    </div>
                    {index < currentService.process.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <ArrowRight className="text-kheops-gold" size={24} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection serviceId={serviceId} />

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions <span className="text-kheops-gold">Fréquentes</span></h2>
              <div className="w-20 h-1 bg-kheops-gold mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Tout ce que vous devez savoir sur notre service de {currentService.title.toLowerCase()}.
              </p>
            </div>

            <div className="space-y-6">
              {currentService.faqs && currentService.faqs.length > 0 ? (
                currentService.faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <details className="group" open={openFaqIndex === index}>
                      <summary
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // Empêche tout comportement de navigation implicite
                            const previousScrollY = window.scrollY;
                            setOpenFaqIndex(openFaqIndex === index ? null : index);
                            // Restaurer la position de défilement après le rendu
                            requestAnimationFrame(() => {
                              window.scrollTo({ top: previousScrollY, behavior: "auto" });
                            });
                          }}
                          className="flex items-center justify-between cursor-pointer p-6"
                        >
                        <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                        <div className="ml-4 shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-kheops-gold group-open:rotate-180 transition-transform duration-300">
                          <ChevronDown size={18} />
                        </div>
                      </summary>
                      <div className="p-6 pt-0 border-t border-gray-100">
                        <div className="pt-4">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      </div>
                    </details>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500">Aucune question fréquente disponible pour le moment.</p>
                </div>
              )}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-500 mb-6">Vous avez d'autres questions ?</p>
              <Link to="/contact" className="inline-flex items-center gap-2 text-kheops-gold hover:text-kheops-salmon transition-colors duration-300">
                Contactez-nous directement <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned with cleaner layout */}
      <section id="contactez-nous" className="py-16 bg-gradient-to-r from-kheops-gold to-kheops-salmon text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Prêt à transformer votre présence digitale ?</h2>
            <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-white opacity-90 mb-10 text-lg leading-relaxed">
              {currentService.id === 'community-management' && (
                'Contactez-nous dès aujourd\'hui pour discuter de votre stratégie de community management et découvrir comment nous pouvons dynamiser votre présence sur les réseaux sociaux.'
              ) || currentService.id === 'creation-sites-web' && (
                'Contactez-nous dès aujourd\'hui pour discuter de votre projet de site web et découvrir comment nous pouvons créer une plateforme numérique qui convertit vos visiteurs en clients.'
              ) || currentService.id === 'identite-visuelle' && (
                'Contactez-nous dès aujourd\'hui pour discuter de votre projet d\'identité visuelle et découvrir comment nous pouvons créer une image de marque qui marquera les esprits.'
              ) || currentService.id === 'strategie-digitale' && (
                'Contactez-nous dès aujourd\'hui pour discuter de votre stratégie digitale et découvrir comment nous pouvons aligner vos actions en ligne avec vos objectifs commerciaux.'
              ) || currentService.id === 'social-media-marketing' && (
                'Contactez-nous dès aujourd\'hui pour discuter de votre projet de social media marketing et découvrir comment nous pouvons vous aider à atteindre vos objectifs commerciaux.'
              ) || currentService.id === 'referencement-seo' && (
                'Contactez-nous dès aujourd\'hui pour discuter de votre projet de référencement SEO et découvrir comment nous pouvons améliorer votre visibilité sur les moteurs de recherche.'
              )}
            </p>
            {currentService.id === 'community-management' ? (
              <Button 
                onClick={() => {
                  // Rediriger vers la page Services avec l'ancre
                  window.location.href = '/services#community-management-pricing';
                }}
                className="bg-white text-kheops-gold hover:bg-gray-100 font-medium px-10 py-6 text-lg rounded-md hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
              >
                Voir nos offres <ChevronRight size={18} />
              </Button>
            ) : (
              <Button 
                onClick={() => window.location.href = '/contact'}
                className="bg-white text-kheops-gold hover:bg-gray-100 font-medium px-10 py-6 text-lg rounded-md hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
              >
                Demander un devis <ChevronRight size={18} />
              </Button>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
