import React, { useEffect, useState } from "react";
import { useCurrency } from '@/contexts/CurrencyContext';
import { motion } from "framer-motion";
import { 
  MessageSquare,   // Community Management
  Layout,          // Création de Sites Web
  PenTool,         // Identité Visuelle 
  Target,          // Stratégie Digitale
  Share2,          // Social Media Marketing
  Search           // Référencement SEO
} from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import PricingFormDialog from "@/components/services/PricingFormDialog";
import ReactGA from 'react-ga4';
import Seo from '@/components/seo/Seo';


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

const Services = () => {
  const { formatPrice } = useCurrency();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"Starter" | "Pro" | "Premium">("Starter");
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [selectedPrice, setSelectedPrice] = useState<number>(90000);
  const navigate = useNavigate();
  

  // Effet parallaxe
  useEffect(() => {
    // Désactiver l'effet parallaxe sur mobile (largeur < 768px)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }
    const handleParallax = () => {
      const parallaxElements = document.querySelectorAll('.parallax');
      const scrolled = window.scrollY;
      
      parallaxElements.forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.speed || '0.5');
        const pos = scrolled * speed;
        (el as HTMLElement).style.transform = `translateY(${pos}px)`;
      });
    };

    window.addEventListener('scroll', handleParallax);
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  useEffect(() => {
    // Vérifier si l'URL contient une ancre
    const hash = window.location.hash;
    if (hash) {
      // Attendre que le DOM soit complètement chargé
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          // Faire défiler jusqu'à l'élément avec une animation fluide
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300); // Délai pour s'assurer que tout est chargé
    } else {
      // Si pas d'ancre, remonter en haut de la page
      window.scrollTo(0, 0);
    }
  }, []);

  const handlePricingButtonClick = (plan: "Starter" | "Pro" | "Premium", period: "monthly" | "quarterly" | "yearly" = "monthly") => {
    let price;
    if (period === "monthly") {
      price = plan === "Starter" ? 90000 : plan === "Pro" ? 150000 : 320000;
    } else if (period === "quarterly") {
      price = plan === "Starter" ? Math.round(90000 * 3 * 0.9) : plan === "Pro" ? Math.round(150000 * 3 * 0.9) : Math.round(320000 * 3 * 0.9);
    } else if (period === "yearly") {
      price = plan === "Starter" ? Math.round(90000 * 12 * 0.85) : plan === "Pro" ? Math.round(150000 * 12 * 0.85) : Math.round(320000 * 12 * 0.85);
    }
    
    // Rediriger vers la page de formulaire avec paramètres en français
    const periodeSlug = period === "monthly" ? "mensuel"
      : period === "quarterly" ? "trimestriel"
      : "annuel";
    navigate(`/services/formulaire-de-souscription?forfait=${plan}&periode=${periodeSlug}&prix=${price}`);
  };

  const services = [
    {
      icon: <MessageSquare size={28} />, // Community Management
      title: "Community Management",
      description: "Stratégies ciblées pour renforcer votre présence sur les réseaux sociaux et engager votre audience de manière authentique.",
      features: [
        "Publication de contenus quotidiens sur vos réseaux sociaux",
        "Interaction avec votre communauté et modération des commentaires",
        "Veille concurrentielle et analyse des tendances",
        "Rapports de performance mensuels détaillés"
      ],
      id: "community-management"
    },
    {
      icon: <Layout size={28} />, // Création de Sites Web
      title: "Création de Sites Web",
      description: "Sites vitrines et e-commerce modernes, responsives et optimisés pour convertir les visiteurs en clients.",
      features: [
        "Design sur mesure adapté à votre identité visuelle",
        "Optimisation pour tous les appareils (desktop, tablette, mobile)",
        "Intégration d'outils d'analyse et de suivi",
        "Maintenance et support technique"
      ],
      id: "creation-sites-web"
    },
    {
      icon: <PenTool size={28} />, // Identité Visuelle
      title: "Identité Visuelle",
      description: "Logos, chartes graphiques et supports visuels qui reflètent l'unicité de votre marque et marquent les esprits.",
      features: [
        "Création de logo et déclinaisons",
        "Définition d'une charte graphique complète",
        "Conception de supports imprimés (cartes de visite, plaquettes...)",
        "Kit de communication digitale (bannières, signatures mail...)"
      ],
      id: "identite-visuelle"
    },
    {
      icon: <Target size={28} />, // Stratégie Digitale
      title: "Stratégie Digitale",
      description: "Élaboration de feuilles de route digitales complètes pour atteindre vos objectifs commerciaux.",
      features: [
        "Audit de votre présence en ligne actuelle",
        "Définition des objectifs et KPIs",
        "Plan d'action personnalisé sur 6 à 12 mois",
        "Accompagnement dans la mise en œuvre"
      ],
      id: "strategie-digitale"
    },
    {
      icon: <Share2 size={28} />, // Social Media Marketing
      title: "Social Media Marketing",
      description: "Campagnes publicitaires ciblées sur les réseaux sociaux pour augmenter votre visibilité et vos conversions.",
      features: [
        "Création et gestion de campagnes publicitaires",
        "Ciblage précis des audiences pertinentes",
        "Optimisation des budgets et enchères",
        "Tests A/B et amélioration continue"
      ],
      id: "social-media-marketing"
    },
    {
      icon: <Search size={28} />, // Référencement SEO
      title: "Référencement SEO",
      description: "Optimisation de votre visibilité sur les moteurs de recherche pour attirer un trafic qualifié sur votre site.",
      features: [
        "Audit SEO complet de votre site",
        "Optimisation on-page (balises, contenus, structure)",
        "Stratégie de création de contenu",
        "Suivi de positionnement et rapports mensuels"
      ],
      id: "referencement-seo"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: 90000,
      period: "/mois",
      description: "L'essentiel pour démarrer votre présence en ligne",
      features: [
        "Gestion de 2 réseaux sociaux",
        "8 publications par mois",
        "Modération des commentaires",
        "Rapport mensuel simplifié"
      ],
      highlighted: false,
      buttonText: "Choisir ce forfait"
    },
    {
      name: "Pro",
      price: 150000,
      period: "/mois",
      description: "La solution complète pour développer votre audience",
      features: [
        "Gestion de 2 réseaux sociaux",
        "16 publications par mois",
        "Création de visuels personnalisés",
        "Modération et réponses aux messages",
        "Veille concurrentielle",
        "Rapport mensuel détaillé"
      ],
      highlighted: true,
      buttonText: "Recommandé"
    },
    {
      name: "Premium",
      price: 320000,
      period: "/mois",
      description: "Une stratégie sur mesure pour maximiser votre impact",
      features: [
        "Gestion de 4 réseaux sociaux",
        "30 publications par mois",
        "Création de contenus avancés",
        "Community management proactif",
        "Stratégie éditoriale personnalisée",
        "Réunion mensuelle de suivi",
        "Rapport d'analyse approfondi"
      ],
      highlighted: false,
      buttonText: "Choisir ce forfait"
    }
  ];

  return (
    <>
      <Seo page="services" />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Form Dialog */}
        <PricingFormDialog 
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          selectedPlan={selectedPlan}
          selectedPeriod={selectedPeriod}
          initialPrice={selectedPrice}
        />
        
        {/* Hero Section */}
        <section className="relative bg-kheops-lightGray pt-32 pb-20 overflow-hidden">
          <div className="container-custom">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 className="mb-6">
                Nos <span className="text-kheops-gold">Services</span>
              </h1>
              <p className="text-gray-700 text-lg mb-10">
                Des solutions digitales sur mesure pour répondre à tous vos besoins en communication, 
                de la stratégie à la mise en œuvre opérationnelle.
              </p>
              <Link to="/contact">
                <Button className="bg-kheops-gold hover:bg-kheops-salmon text-white px-4 sm:px-8 py-4 sm:py-6 rounded-md transition-all duration-300 text-base sm:text-lg"
                  onClick={() => ReactGA.event({ category: 'ServicesPage', action: 'Click Hero Devis', label: 'Demander un devis personnalisé' })}>
                  Demander un devis personnalisé
                </Button>
              </Link>
            </motion.div>
          </div>
          {/* Background decorative elements */}
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-kheops-gold opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-kheops-salmon opacity-10 rounded-full blur-3xl"></div>
        </section>

        {/* Detailed Service Descriptions */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="mb-4">Nos <span className="text-kheops-gold">Expertises</span></h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Des solutions digitales complètes pour développer votre activité et maximiser votre impact en ligne.
              </p>
            </div>

            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {services.map((service, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card className="h-full transition-all duration-300 hover:shadow-lg border border-gray-100 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-kheops-gold/5 to-kheops-salmon/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <CardHeader className="pb-2 relative">
                      <motion.div 
                        className="w-20 h-20 flex items-center justify-center rounded-full mb-5 relative z-10"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {/* Outer gradient ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-kheops-gold to-kheops-salmon opacity-20"></div>
                        
                        {/* Inner solid background */}
                        <div className="absolute inset-1 rounded-full bg-white"></div>
                        
                        {/* Icon centered */}
                        <div className="relative z-10 text-kheops-gold">
                          {service.icon}
                        </div>
                        
                        {/* Animated glow effect on hover */}
                        <div className="absolute inset-0 rounded-full bg-kheops-gold opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-700"></div>
                        
                        {/* Ripple effect on hover */}
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100">
                          <span className="absolute inset-0 rounded-full bg-kheops-gold/20 animate-ripple"></span>
                        </div>
                      </motion.div>
                      
                      <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 mb-6">
                        {service.description}
                      </CardDescription>
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-kheops-gold mr-2 flex-shrink-0">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link to={`/services/${service.id}`} className="relative z-10">
                        <Button className="mt-6 bg-white text-kheops-gold hover:bg-kheops-gold hover:text-white border border-kheops-gold transition-all duration-300 w-full sm:w-auto relative z-10"
                          onClick={() => ReactGA.event({ category: 'ServicesPage', action: 'Click Service EnSavoirPlus', label: service.title })}>
                          En savoir plus
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Community Management Packages */}
        <section className="py-20 bg-kheops-lightGray">
          <div className="container-custom">
            <div className="text-center mb-16 scroll-mt-16" id="community-management-pricing">
              <h2 className="mb-4">Forfaits <span className="text-kheops-gold">Community Management</span></h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Des formules adaptées à vos besoins pour gérer efficacement votre présence sur les réseaux sociaux.
              </p>
            </div>

            <Tabs defaultValue="monthly" className="w-full">
              <div className="mb-6 flex justify-center">
                <TabsList className="bg-white mx-auto">
                  <TabsTrigger value="monthly" className="data-[state=active]:bg-kheops-gold data-[state=active]:text-white" onClick={() => { setSelectedPeriod("monthly"); ReactGA.event({ category: 'ServicesPage', action: 'Click Tab', label: 'Mensuel' }); }}>Mensuel</TabsTrigger>
                  <TabsTrigger value="quarterly" className="data-[state=active]:bg-kheops-gold data-[state=active]:text-white" onClick={() => { setSelectedPeriod("quarterly"); ReactGA.event({ category: 'ServicesPage', action: 'Click Tab', label: 'Trimestriel' }); }}>Trimestriel (-10%)</TabsTrigger>
                  <TabsTrigger value="yearly" className="data-[state=active]:bg-kheops-gold data-[state=active]:text-white" onClick={() => { setSelectedPeriod("yearly"); ReactGA.event({ category: 'ServicesPage', action: 'Click Tab', label: 'Annuel' }); }}>Annuel (-15%)</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="monthly" className="mt-0">
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  {pricingPlans.map((plan, index) => (
                    <motion.div key={index} variants={fadeIn} className="flex">
                      <Card className={`flex flex-col w-full transition-all duration-300 hover:shadow-lg ${
                        plan.highlighted ? 'border-2 border-kheops-gold relative shadow-md' : 'border border-gray-200'
                      }`}>
                        {plan.highlighted && (
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-kheops-gold text-white text-sm font-bold py-1 px-4 rounded-full">
                            Populaire
                          </div>
                        )}
                        <CardHeader className="text-center">
                          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                          <div className="mt-4 mb-2">
                            <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                            <span className="text-gray-500">{plan.period}</span>
                          </div>
                          <CardDescription className="text-gray-600">
                            {plan.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <ul className="space-y-3 mb-8">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-kheops-gold mr-2">✓</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button 
                            className={`w-full ${
                              plan.highlighted 
                                ? 'bg-kheops-gold hover:bg-kheops-salmon text-white' 
                                : 'bg-white text-kheops-gold hover:bg-kheops-gold hover:text-white border border-kheops-gold'
                            } transition-all duration-300 mt-auto`}
                            onClick={() => { ReactGA.event({ category: 'ServicesPage', action: 'Click Forfait', label: `${plan.name} - ${selectedPeriod}` }); handlePricingButtonClick(plan.name as "Starter" | "Pro" | "Premium", selectedPeriod); }}
                          >
                            {plan.buttonText}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="quarterly" className="mt-0">
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  {pricingPlans.map((plan, index) => {
                    // Calcul du prix trimestriel (3 mois avec 10% de réduction)
                    const basePrice = plan.price;
                    const quarterlyPrice = Math.round(basePrice * 3 * 0.9);
                    
                    return (
                      <motion.div key={index} variants={fadeIn} className="flex">
                        <Card className={`flex flex-col w-full transition-all duration-300 hover:shadow-lg ${
                          plan.highlighted ? 'border-2 border-kheops-gold relative shadow-md' : 'border border-gray-200'
                        }`}>
                          {plan.highlighted && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-kheops-gold text-white text-sm font-bold py-1 px-4 rounded-full">
                              Populaire
                            </div>
                          )}
                          <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                            <div className="mt-4 mb-2">
                              <span className="text-4xl font-bold">{formatPrice(quarterlyPrice)}</span>
                              <span className="text-gray-500">/trimestre</span>
                            </div>
                            <CardDescription className="text-gray-600">
                              {plan.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <ul className="space-y-3 mb-8">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-kheops-gold mr-2">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button 
                              className={`w-full ${
                                plan.highlighted 
                                  ? 'bg-kheops-gold hover:bg-kheops-salmon text-white' 
                                  : 'bg-white text-kheops-gold hover:bg-kheops-gold hover:text-white border border-kheops-gold'
                              } transition-all duration-300 mt-auto`}
                              onClick={() => { ReactGA.event({ category: 'ServicesPage', action: 'Click Forfait', label: `${plan.name} - ${selectedPeriod}` }); handlePricingButtonClick(plan.name as "Starter" | "Pro" | "Premium", selectedPeriod); }}
                            >
                              {plan.buttonText}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </TabsContent>
              
              <TabsContent value="yearly" className="mt-0">
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  {pricingPlans.map((plan, index) => {
                    // Calcul du prix annuel (12 mois avec 15% de réduction)
                    const basePrice = plan.price;
                    const yearlyPrice = Math.round(basePrice * 12 * 0.85);
                    
                    return (
                      <motion.div key={index} variants={fadeIn} className="flex">
                        <Card className={`flex flex-col w-full transition-all duration-300 hover:shadow-lg ${
                          plan.highlighted ? 'border-2 border-kheops-gold relative shadow-md' : 'border border-gray-200'
                        }`}>
                          {plan.highlighted && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-kheops-gold text-white text-sm font-bold py-1 px-4 rounded-full">
                              Populaire
                            </div>
                          )}
                          <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                            <div className="mt-4 mb-2">
                              <span className="text-4xl font-bold">{formatPrice(yearlyPrice)}</span>
                              <span className="text-gray-500">/an</span>
                            </div>
                            <CardDescription className="text-gray-600">
                              {plan.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <ul className="space-y-3 mb-8">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-kheops-gold mr-2">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button 
                              className={`w-full ${
                                plan.highlighted 
                                  ? 'bg-kheops-gold hover:bg-kheops-salmon text-white' 
                                  : 'bg-white text-kheops-gold hover:bg-kheops-gold hover:text-white border border-kheops-gold'
                              } transition-all duration-300 mt-auto`}
                              onClick={() => { ReactGA.event({ category: 'ServicesPage', action: 'Click Forfait', label: `${plan.name} - ${selectedPeriod}` }); handlePricingButtonClick(plan.name as "Starter" | "Pro" | "Premium", selectedPeriod); }}
                            >
                              {plan.buttonText}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="mb-4">Notre <span className="text-kheops-gold">Processus</span></h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Une méthodologie éprouvée pour assurer le succès de vos projets digitaux.
              </p>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {/* Connecting line */}
              <div className="hidden lg:block absolute top-24 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-0.5 bg-gray-200"></div>
              
              {/* Process steps */}
              <motion.div variants={fadeIn} className="relative">
                <div className="text-center">
                  <div className="w-12 h-12 bg-kheops-gold text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">1</div>
                  <h3 className="text-xl font-bold mb-2">Analyse</h3>
                  <p className="text-gray-600">Évaluation de vos besoins, objectifs et de l'environnement concurrentiel.</p>
                </div>
              </motion.div>
              
              <motion.div variants={fadeIn} className="relative">
                <div className="text-center">
                  <div className="w-12 h-12 bg-kheops-gold text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">2</div>
                  <h3 className="text-xl font-bold mb-2">Stratégie</h3>
                  <p className="text-gray-600">Élaboration d'un plan d'action personnalisé pour atteindre vos objectifs.</p>
                </div>
              </motion.div>
              
              <motion.div variants={fadeIn} className="relative">
                <div className="text-center">
                  <div className="w-12 h-12 bg-kheops-gold text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">3</div>
                  <h3 className="text-xl font-bold mb-2">Exécution</h3>
                  <p className="text-gray-600">Mise en œuvre des solutions et déploiement des actions définies.</p>
                </div>
              </motion.div>
              
              <motion.div variants={fadeIn} className="relative">
                <div className="text-center">
                  <div className="w-12 h-12 bg-kheops-gold text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">4</div>
                  <h3 className="text-xl font-bold mb-2">Optimisation</h3>
                  <p className="text-gray-600">Suivi des résultats, analyse et amélioration continue des performances.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-kheops-gold to-kheops-salmon text-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="mb-6 text-white">Prêt à transformer votre présence digitale ?</h2>
              <p className="text-white opacity-90 mb-8 text-lg">
                Contactez-nous dès aujourd'hui pour discuter de votre projet et découvrir comment nous pouvons vous aider à atteindre vos objectifs.
              </p>
              <div className="flex justify-center">
                <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-kheops-gold font-medium px-8 py-6 text-lg mx-auto"
                  onClick={() => ReactGA.event({ category: 'ServicesPage', action: 'Click CTA', label: 'Prendre rendez-vous' })}>
                  Prendre rendez-vous
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Services;
