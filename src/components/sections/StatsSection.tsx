import React from 'react';
import { motion } from 'framer-motion';
import { StatisticCard } from '@/components/ui/StatisticCard';
import { Users, Search, BarChart2, Smartphone, Mail, TrendingUp, Zap, Target, Clock, Share2, Eye, MessageSquare, ShoppingCart, DollarSign, Smartphone as SmartphoneIcon, Monitor, PenTool, BarChart, Hash, ThumbsUp, MessageCircle, UserPlus, Heart, Globe, Video, Camera } from 'lucide-react';

interface Stat {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface StatsSectionProps {
  serviceId?: string;
  customTitle?: string;
  customDescription?: string;
  customStats?: Stat[];
}

export function StatsSection({ serviceId, customTitle, customDescription, customStats }: StatsSectionProps) {
  // Statistiques par défaut (génériques)
  const defaultStats = [
    {
      value: "97%",
      label: "Des consommateurs",
      description: "recherchent en ligne avant d'acheter un produit ou un service",
      icon: <Search className="w-6 h-6" />
    },
    {
      value: "75%",
      label: "Des utilisateurs",
      description: "ne font jamais défiler au-delà de la première page de résultats",
      icon: <BarChart2 className="w-6 h-6" />
    }
  ];

  // Statistiques spécifiques par service
  const serviceStats: Record<string, Stat[]> = {
    "community-management": [
      {
        value: "90%",
        label: "Des utilisateurs",
        description: "suivent au moins une marque sur les réseaux sociaux",
        icon: <Users className="w-6 h-6" />
      },
      {
        value: "71%",
        label: "Des consommateurs",
        description: "sont plus susceptibles d'acheter après une expérience positive sur les réseaux sociaux",
        icon: <ThumbsUp className="w-6 h-6" />
      },
      {
        value: "4.5x",
        label: "Plus d'engagement",
        description: "pour les publications avec vidéo par rapport aux images",
        icon: <Video className="w-6 h-6" />
      },
      {
        value: "80%",
        label: "Des utilisateurs Instagram",
        description: "suivent au moins une entreprise",
        icon: <UserPlus className="w-6 h-6" />
      },
      {
        value: "54%",
        label: "Des utilisateurs",
        description: "utilisent les réseaux sociaux pour rechercher des produits",
        icon: <ShoppingCart className="w-6 h-6" />
      },
      {
        value: "3x",
        label: "Plus de temps",
        description: "passé sur les réseaux sociaux qu'à regarder la télévision",
        icon: <Clock className="w-6 h-6" />
      }
    ],
    "creation-sites-web": [
      {
        value: "<1s",
        label: "Temps de chargement",
        description: "idéal pour éviter l'abandon des visiteurs",
        icon: <Zap className="w-6 h-6" />
      },
      {
        value: "53%",
        label: "Des mobinautes",
        description: "quittent un site qui met plus de 3 secondes à charger",
        icon: <SmartphoneIcon className="w-6 h-6" />
      },
      {
        value: "+70%",
        label: "De temps passé",
        description: "sur les sites mobiles par rapport au desktop",
        icon: <Monitor className="w-6 h-6" />
      },
      {
        value: "94%",
        label: "Des premières impressions",
        description: "sont liées au design d'un site web",
        icon: <PenTool className="w-6 h-6" />
      },
      {
        value: "38%",
        label: "Des visiteurs",
        description: "ne restent pas sur un site au design peu attrayant",
        icon: <Eye className="w-6 h-6" />
      },
      {
        value: "+200%",
        label: "D'augmentation",
        description: "du temps moyen passé sur les sites mobiles rapides",
        icon: <BarChart className="w-6 h-6" />
      }
    ],
    "identite-visuelle": [
      {
        value: "80%",
        label: "De reconnaissance",
        description: "des couleurs augmente la reconnaissance de la marque",
        icon: <Eye className="w-6 h-6" />
      },
      {
        value: "90%",
        label: "Des décisions d'achat",
        description: "sont influencées par les facteurs visuels",
        icon: <ShoppingCart className="w-6 h-6" />
      },
      {
        value: "+80%",
        label: "De mémorisation",
        description: "des informations visuelles contre 20% pour le texte",
        icon: <MessageSquare className="w-6 h-6" />
      },
      {
        value: "3,2s",
        label: "Temps moyen",
        description: "pour qu'un logo crée une première impression",
        icon: <Clock className="w-6 h-6" />
      },
      {
        value: "65%",
        label: "Des personnes",
        description: "se souviennent des informations contenant des images",
        icon: <Camera className="w-6 h-6" />
      },
      {
        value: "+33%",
        label: "D'engagement",
        description: "pour les publications avec des visuels attrayants",
        icon: <Heart className="w-6 h-6" />
      }
    ],
    "strategie-digitale": [
      {
        value: "+126%",
        label: "De croissance",
        description: "moyenne du trafic avec une stratégie de contenu efficace",
        icon: <TrendingUp className="w-6 h-6" />
      },
      {
        value: "3x",
        label: "Plus de leads",
        description: "générés par le marketing entrant vs marketing sortant",
        icon: <Users className="w-6 h-6" />
      },
      {
        value: "82%",
        label: "Des entreprises",
        description: "utilisent désormais le marketing de contenu",
        icon: <BarChart className="w-6 h-6" />
      },
      {
        value: "5x",
        label: "Plus de trafic",
        description: "pour les entreprises qui bloguent régulièrement",
        icon: <Globe className="w-6 h-6" />
      },
      {
        value: "74%",
        label: "Des entreprises",
        description: "ont augmenté leur budget marketing digital en 2023",
        icon: <DollarSign className="w-6 h-6" />
      },
      {
        value: "89%",
        label: "Des marketeurs",
        description: "considèrent le ROI du marketing de contenu comme excellent",
        icon: <ThumbsUp className="w-6 h-6" />
      }
    ],
    "social-media-marketing": [
      {
        value: "4.2Mds",
        label: "D'utilisateurs",
        description: "actifs sur les réseaux sociaux dans le monde",
        icon: <Users className="w-6 h-6" />
      },
      {
        value: "54%",
        label: "Des acheteurs",
        description: "utilisent les réseaux pour rechercher des produits",
        icon: <ShoppingCart className="w-6 h-6" />
      },
      {
        value: "71%",
        label: "Des consommateurs",
        description: "sont plus susceptibles d'acheter après une expérience positive",
        icon: <ThumbsUp className="w-6 h-6" />
      },
      {
        value: "+90%",
        label: "Des vidéos",
        description: "sont visionnées avec le son coupé - sous-titres essentiels",
        icon: <Video className="w-6 h-6" />
      },
      {
        value: "1h30",
        label: "Par jour",
        description: "passées en moyenne sur les réseaux sociaux",
        icon: <Clock className="w-6 h-6" />
      },
      {
        value: "+49%",
        label: "D'engagement",
        description: "en plus pour les vidéos en direct vs vidéos normales",
        icon: <MessageCircle className="w-6 h-6" />
      }
    ],
    "referencement-seo": [
      {
        value: "#1",
        label: "Position",
        description: "reçoit 31,7% du trafic de recherche organique",
        icon: <Target className="w-6 h-6" />
      },
      {
        value: "0.78s",
        label: "Temps moyen",
        description: "pour qu'un utilisateur choisisse un résultat de recherche",
        icon: <Clock className="w-6 h-6" />
      },
      {
        value: "75%",
        label: "Des clics",
        description: "vont aux 5 premiers résultats de recherche",
        icon: <BarChart className="w-6 h-6" />
      },
      {
        value: "+300%",
        label: "De trafic",
        description: "pour les sites optimisés pour les recherches vocales",
        icon: <Smartphone className="w-6 h-6" />
      },
      {
        value: "40%",
        label: "Des revenus",
        description: "viennent du trafic organique pour les e-commerces",
        icon: <DollarSign className="w-6 h-6" />
      },
      {
        value: "93%",
        label: "Des expériences en ligne",
        description: "commencent par un moteur de recherche",
        icon: <Search className="w-6 h-6" />
      }
    ]
  };

  // Sélection des statistiques en fonction du service ou utilisation des stats personnalisées
  const stats = customStats || (serviceId && serviceStats[serviceId as keyof typeof serviceStats]) || defaultStats;
  const title = customTitle || "Les chiffres qui parlent d'eux-mêmes";
  const description = customDescription || "Découvrez pourquoi une présence en ligne optimisée est essentielle pour votre entreprise";

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Les <span className="text-kheops-gold">chiffres</span> qui parlent d'<span className="text-kheops-gold">eux-mêmes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez pourquoi une présence en ligne optimisée est essentielle pour votre entreprise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatisticCard
              key={index}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              icon={stat.icon}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 