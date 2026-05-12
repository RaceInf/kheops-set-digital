import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { 
  Check, 
  ChevronLeft, 
  Clock, 
  Shield, 
  Zap, 
  Users, 
  BarChart2, 
  MessageCircle, 
  TrendingUp, 
  Target,
  Sparkles,
  Rocket,
  Heart,
  Star
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PricingContactForm from "@/components/services/PricingContactForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from '@/contexts/CurrencyContext';
import { sendGA4ServerEvent } from '@/lib/ga4ServerEvent';
import Seo from '@/components/seo/Seo';

// Prix de base en XAF
const BASE_PRICES = {
  Starter: 90000,
  Pro: 150000,
  Premium: 320000
};

const PricingFormPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currency, formatPrice } = useCurrency();
  const searchParams = new URLSearchParams(location.search);
  
  const selectedPlan = (searchParams.get('forfait') as "Starter" | "Pro" | "Premium") || "Starter";
  const periodeParam = searchParams.get('periode') || 'mensuel';
  const selectedPeriod = periodeParam === 'mensuel' ? 'monthly'
    : periodeParam === 'trimestriel' ? 'quarterly'
    : periodeParam === 'annuel' ? 'yearly'
    : 'monthly';
  const urlPrix = Number(searchParams.get('prix') || 0);
  const [basePrice, setBasePrice] = useState<number>(urlPrix);

  // Calculer le prix en fonction de la période
  useEffect(() => {
    if (urlPrix) return; // utiliser prix depuis l'URL si présent
    const price = BASE_PRICES[selectedPlan];
    let periodPrice = price;

    if (selectedPeriod === "quarterly") {
      periodPrice = Math.round(price * 3 * 0.9); // -10% pour trimestriel
    } else if (selectedPeriod === "yearly") {
      periodPrice = Math.round(price * 12 * 0.85); // -15% pour annuel
    }

    setBasePrice(periodPrice);
  }, [selectedPlan, selectedPeriod, urlPrix]);

  const handleSuccess = async () => {
    // Tracking server-side GA4
    await sendGA4ServerEvent({
      eventName: 'subscription',
      params: {
        plan: selectedPlan,
        period: selectedPeriod,
        value: basePrice,
        currency: currency,
      },
    });
    // Redirect to Services page, Community Management section
    navigate('/services#community-management-pricing');
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "monthly": return "Mensuel";
      case "quarterly": return "Trimestriel (-10%)";
      case "yearly": return "Annuel (-15%)";
      default: return "Mensuel";
    }
  };

  const getPlanFeatures = (plan: string) => {
    const features = {
      Starter: [
        { icon: <Users className="h-5 w-5" />, text: "Gestion de 2 réseaux sociaux" },
        { icon: <BarChart2 className="h-5 w-5" />, text: "Rapport mensuel d'activité" },
        { icon: <Zap className="h-5 w-5" />, text: "Publication de 8 posts par mois" },
        { icon: <MessageCircle className="h-5 w-5" />, text: "Réponse aux commentaires" }
      ],
      Pro: [
        { icon: <Users className="h-5 w-5" />, text: "Gestion de 3 réseaux sociaux" },
        { icon: <BarChart2 className="h-5 w-5" />, text: "Rapport hebdomadaire détaillé" },
        { icon: <Zap className="h-5 w-5" />, text: "Publication de 16 posts par mois" },
        { icon: <MessageCircle className="h-5 w-5" />, text: "Gestion complète des interactions" },
        { icon: <TrendingUp className="h-5 w-5" />, text: "Stratégie de croissance" }
      ],
      Premium: [
        { icon: <Users className="h-5 w-5" />, text: "Gestion de 4 réseaux sociaux" },
        { icon: <Zap className="h-5 w-5" />, text: "30 publications par mois" },
        { icon: <Sparkles className="h-5 w-5" />, text: "Création de contenus avancés" },
        { icon: <MessageCircle className="h-5 w-5" />, text: "Community management proactif" },
        { icon: <TrendingUp className="h-5 w-5" />, text: "Stratégie éditoriale personnalisée" },
        { icon: <Clock className="h-5 w-5" />, text: "Réunion mensuelle de suivi" },
        { icon: <BarChart2 className="h-5 w-5" />, text: "Rapport d'analyse approfondi" }
      ]
    };
    return features[plan as keyof typeof features] || [];
  };

  const getValuePropositions = () => [
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Expertise Locale",
      description: "Une équipe camerounaise qui comprend parfaitement votre marché et votre audience"
    },
    {
      icon: <Rocket className="h-5 w-5" />,
      title: "Croissance Accélérée",
      description: "Stratégies éprouvées pour augmenter votre visibilité et votre engagement"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Relation Privilégiée",
      description: "Un accompagnement personnalisé et une communication directe avec votre community manager"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Contenu Premium",
      description: "Des créations originales et adaptées à l'identité de votre marque"
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Seo 
        title={`Souscription - Forfait ${selectedPlan} | KHEOPS SET DIGITAL`}
        description={`Souscrivez à notre forfait ${selectedPlan} de community management et développez votre présence sur les réseaux sociaux.`}
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        
        <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 pt-24 sm:pt-28 md:pt-32">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Button
              variant="ghost"
              className="mb-4 sm:mb-6 md:mb-8 text-kheops-gold hover:text-kheops-gold/80 hover:bg-kheops-gold/5 text-sm sm:text-base"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
              Retour
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Colonne de gauche - Résumé du forfait */}
              <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                <Card className="border-kheops-gold/20 bg-white/50 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <Badge variant="outline" className="text-xs sm:text-sm bg-kheops-gold/10 text-kheops-gold border-kheops-gold/20">
                        {getPeriodLabel()}
                      </Badge>
                      <Badge className="text-xs sm:text-sm bg-kheops-gold text-white">
                        {selectedPlan}
                      </Badge>
                    </div>
                    
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Forfait {selectedPlan}</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                      Une solution complète pour développer votre présence sur les réseaux sociaux
                    </p>

                    <Separator className="my-3 sm:my-4" />

                    <div className="space-y-3 sm:space-y-4">
                      {getPlanFeatures(selectedPlan).map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 sm:gap-3">
                          <div className="text-kheops-gold mt-0.5 flex-shrink-0">
                            {feature.icon}
                          </div>
                          <span className="text-sm sm:text-base text-gray-700">{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-kheops-gold/5 rounded-lg border border-kheops-gold/20">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base text-gray-600">Prix total</span>
                          <div className="text-right min-w-[120px] sm:min-w-[140px]">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-base sm:text-lg md:text-2xl font-bold text-kheops-gold whitespace-nowrap">
                                {formatPrice(basePrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 text-right">
                          {selectedPeriod === 'monthly' ? 'par mois' : 
                           selectedPeriod === 'quarterly' ? 'pour 3 mois' : 
                           'pour 12 mois'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne de droite - Formulaire */}
              <div className="lg:col-span-2">
                <Card className="border-kheops-gold/20 bg-white/50 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="text-center mb-6 sm:mb-8">
                      <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
                        Souscription au forfait {' '}
                        <span className="bg-gradient-to-r from-kheops-gold to-kheops-salmon bg-clip-text text-transparent">
                          {selectedPlan}
                        </span>
                      </h1>
                      <p className="text-sm sm:text-base text-gray-600">
                        Complétez le formulaire ci-dessous pour souscrire à votre forfait
                      </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                      <PricingContactForm 
                        initialPlan={selectedPlan}
                        initialPeriod={selectedPeriod}
                        initialPrice={basePrice}
                        onSuccess={handleSuccess}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PricingFormPage; 