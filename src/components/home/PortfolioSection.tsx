
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Projets de portfolio
const portfolioItems = [
  {
    id: 1,
    title: "Refonte Site E-commerce",
    category: "web-design",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    client: "Mode Élégance",
    description: "Refonte complète d'une boutique en ligne avec optimisation UX et intégration de paiement."
  },
  {
    id: 2,
    title: "Campagne Social Media",
    category: "social-media",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    client: "Green Energy",
    description: "Stratégie de contenu cross-platform ayant généré +200% d'engagement."
  },
  {
    id: 3,
    title: "Application Mobile",
    category: "app",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    client: "HealthTech Solutions",
    description: "Développement d'une app de suivi de santé avec tableau de bord utilisateur."
  },
  {
    id: 4,
    title: "Branding Corporate",
    category: "branding",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    client: "Nexus Finance",
    description: "Création d'identité visuelle complète incluant logo, charte graphique et templates."
  },
  {
    id: 5,
    title: "SEO & Content Marketing",
    category: "marketing",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    client: "Voyage Explorer",
    description: "Stratégie SEO ayant amélioré le trafic organique de 150% en 6 mois."
  },
  {
    id: 6,
    title: "Vidéo Promotionnelle",
    category: "video",
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    client: "SportMax",
    description: "Production vidéo pour le lancement d'une nouvelle gamme de produits sportifs."
  }
];

const categories = [
  { id: "all", name: "Tous" },
  { id: "web-design", name: "Web Design" },
  { id: "social-media", name: "Social Media" },
  { id: "app", name: "Applications" },
  { id: "branding", name: "Branding" },
  { id: "marketing", name: "Marketing" },
  { id: "video", name: "Vidéo" }
];

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  
  const filteredItems = activeFilter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section className="py-20 bg-white" id="portfolio">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4">Nos <span className="text-kheops-gold">Réalisations</span></h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Découvrez une sélection de nos projets qui illustrent notre expertise et notre créativité au service de nos clients.
            </p>
          </motion.div>
        </div>

        {/* Filtres */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category.id
                  ? "bg-kheops-gold text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Grille de portfolio */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={item.id}
              className="relative overflow-hidden rounded-lg shadow-md group"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy" 
                />
              </div>
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 flex flex-col justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredItem === item.id ? 1 : 0.6 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-white text-xl font-bold">{item.title}</h3>
                <p className="text-white/80 mb-2">Client: {item.client}</p>
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center">
                  <Button size="sm" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-gray-900">
                    <Link to={`/portfolio/${item.id}`} className="flex items-center">
                      Voir détails <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Button asChild className="bg-kheops-gold hover:bg-kheops-salmon text-white transition-colors duration-300">
            <Link to="/portfolio">Explorer tous nos projets</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
