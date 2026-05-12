import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import SocialIcon from '@/components/SocialIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Heart, Target, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Seo from '@/components/seo/Seo';

const Apropos = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const values = [
    {
      icon: <Target className="w-10 h-10 text-kheops-gold" />,
      title: "Notre Mission",
      description: "Fournir des solutions digitales innovantes pour propulser votre business."
    },
    {
      icon: <Heart className="w-10 h-10 text-kheops-salmon" />,
      title: "Notre Vision",
      description: "Devenir l'agence de référence pour les entreprises qui cherchent à innover et à se démarquer dans le monde digital."
    },
    {
      icon: <Briefcase className="w-10 h-10 text-kheops-gold" />,
      title: "Nos Valeurs",
      description: "Intégrité, créativité, expertise et passion pour le digital."
    },
    {
      icon: <Users className="w-10 h-10 text-kheops-salmon" />,
      title: "Notre Équipe",
      description: "Une équipe de professionnels passionnés et dédiés qui travaillent ensemble pour fournir des solutions digitales de haute qualité."
    }
  ];

  const milestones = [
    { 
      year: "2020", 
      title: "Une Vision est Née", 
      description: "Création de KHEOPS SET DIGITAL avec une conviction : le digital doit être accessible à toutes les entreprises, quelle que soit leur taille." 
    },
    { 
      year: "2021", 
      title: "Premières Réussites", 
      description: "Nos premiers clients nous font confiance, validant notre approche personnalisée et notre engagement envers des résultats concrets." 
    },
    { 
      year: "2022", 
      title: "Croissance Organique", 
      description: "Notre réputation grandit grâce au bouche-à-oreille, preuve de la satisfaction de nos clients et de l'efficacité de nos solutions." 
    },
    { 
      year: "2023", 
      title: "Expertise Confirmée", 
      description: "Notre équipe s'étoffe pour répondre à une demande croissante, tout en maintenant notre engagement qualité et proximité." 
    },
    { 
      year: "2024", 
      title: "Innovation Continue", 
      description: "Nous affinons nos méthodes et intégrons les dernières technologies pour offrir des solutions toujours plus performantes à nos clients." 
    },
    { 
      year: "2025", 
      title: "L'Aventure Continue", 
      description: "Forts de notre expérience, nous continuons d'accompagner les entreprises dans leur transformation digitale avec la même passion qu'au premier jour." 
    }
  ];

  // State for mobile timeline carousel
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMilestoneIndex((prev) => (prev + 1) % milestones.length);
    }, 4000); // switch every 4s
    return () => clearInterval(interval);
  }, [milestones.length]);

  // État contrôlé par le développeur pour la visibilité des réseaux sociaux
  const socialVisibility = {
    opportun: { twitter: false, instagram: false, linkedin: false },
    martine: { twitter: false, instagram: false, linkedin: false },
    kofi: { twitter: false, instagram: false, linkedin: false },
    edwige: { twitter: false, instagram: false, linkedin: false }
  };

  // Fonction pour déterminer si un réseau social doit être affiché
  const shouldShowSocial = (member: string, network: string) => {
    return socialVisibility[member as keyof typeof socialVisibility]?.[network as keyof typeof socialVisibility.opportun] || false;
  };

  // Données des membres de l'équipe avec expertises
  const teamMembers = [
    {
      id: 'opportun',
      name: 'Opportun ABY',
      role: 'Fondateur & CEO',
      bio: 'Expert en stratégie digitale et développement commercial avec plus de 6 ans d\'expérience.',
      expertise: ['Stratégie Digitale', 'Business Development', 'Gestion de Projet'],
      image: '/images/team/opportun-aby.jpg'
    },
    {
      id: 'martine',
      name: 'Martine FOKAM',
      role: 'Directrice Artistique',
      bio: 'Designer graphique passionnée avec un œil pour les tendances et l\'innovation visuelle.',
      expertise: ['UI/UX Design', 'Direction Artistique', 'Branding'],
      image: '/images/team/martine-fokam.jpg'
    },
    {
      id: 'kofi',
      name: 'Kofi MENSAH',
      role: 'Directeur Technique',
      bio: 'Développeur full-stack expérimenté spécialisé dans les solutions évolutives et performantes.',
      expertise: ['Développement Web', 'Architecture Logicielle', 'DevOps'],
      image: '/images/team/kofi-mensah.jpg'
    },
    {
      id: 'edwige',
      name: 'Edwige NJONA',
      role: 'Community Manager',
      bio: 'Spécialiste des médias sociaux et de la stratégie de contenu engageant.',
      expertise: ['Social Media', 'Stratégie de Contenu', 'Marketing Digital'],
      image: '/images/team/edwige-njona.jpg'
    }
  ];

  // Effet parallaxe
  useEffect(() => {
    // Désactiver parallaxe sur mobile
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

  return (
    <>
      <Seo page="apropos" />
      <Helmet>
        <title>À propos | KHEOPS SET DIGITAL - Notre Histoire</title>
        <meta name="description" content="Découvrez la vision, l'équipe et les valeurs de KHEOPS SET DIGITAL, agence web et marketing digital basée à Douala." />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="relative overflow-hidden">
          {/* Boules décoratives avec effet parallaxe */}
          <div 
            className="absolute -top-20 -right-40 w-80 h-80 rounded-full bg-kheops-gold/10 parallax" 
            data-speed="0.3"
          ></div>
          <div 
            className="absolute top-1/3 -left-20 w-60 h-60 rounded-full bg-kheops-salmon/10 parallax" 
            data-speed="0.5"
          ></div>
          <div 
            className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-kheops-teal/10 parallax" 
            data-speed="0.4"
          ></div>
          
          {/* Hero Section */}
          <section className="pt-32 pb-16 bg-gradient-to-r from-gray-50 to-white">
            <div className="container-custom">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="text-center max-w-3xl mx-auto"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  À Propos de <span className="text-kheops-gold">Nous</span>
                </h1>
                <p className="text-gray-600 text-lg md:text-xl mb-8">
                  Découvrez l'équipe passionnée derrière KHEOPS SET DIGITAL et notre mission de transformation digitale.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-16 bg-white">
            <div className="container-custom">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold mb-6">Notre <span className="text-kheops-gold">Mission</span></h2>
                  <p className="text-gray-600 mb-4">
                    KHEOPS SET DIGITAL est née d'une vision simple mais ambitieuse : accompagner les entreprises dans leur transformation digitale en proposant des solutions sur mesure, innovantes et impactantes.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Notre mission est d'être le partenaire stratégique qui vous aide à naviguer dans l'écosystème digital en constante évolution, en combinant expertise technique, créativité et compréhension approfondie de vos objectifs d'affaires.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Nous croyons que la réussite digitale n'est pas seulement une question de technologie, mais aussi d'expérience humaine et d'alignement stratégique avec vos valeurs et vos ambitions.
                  </p>
                  <Link 
                    to="/services"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-kheops-gold to-kheops-salmon hover:from-kheops-gold/90 hover:to-kheops-salmon/90 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => ReactGA.event({ category: 'AproposPage', action: 'Click DecouvrirServices', label: 'Découvrir nos services' })}
                  >
                    Découvrir nos services
                  </Link>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="relative z-10 overflow-hidden rounded-lg shadow-xl">
                    <img 
                      src="/images/team/meeting-ksd.jpg"
                      alt="Notre équipe en réunion" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-kheops-salmon rounded-full opacity-20 z-0"></div>
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-kheops-gold rounded-full opacity-20 z-0"></div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 bg-gray-50">
            <div className="container-custom">
              <motion.div 
                className="text-center max-w-3xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Nos <span className="text-kheops-gold">Valeurs</span></h2>
                <p className="text-gray-600">
                  Ces principes fondamentaux guident notre travail au quotidien et définissent notre identité en tant qu'agence.
                </p>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    variants={fadeIn}
                  >
                    <div className="mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="py-16 bg-white">
            <div className="container-custom">
              <motion.div 
                className="text-center max-w-3xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Notre <span className="text-kheops-gold">Histoire</span></h2>
                <p className="text-gray-600">
                  Un parcours d'innovation et de croissance depuis notre création.
                </p>
              </motion.div>

              <div className="relative hidden sm:block">
                {/* Vertical line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
                
                {/* Timeline items */}
                <div className="space-y-12">
                  {milestones.map((milestone, index) => (
                    <motion.div 
                      key={index}
                      className={`relative flex items-center ${
                        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                      }`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-1/2"></div>
                      
                      {/* Circle on timeline */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-kheops-gold flex items-center justify-center z-10">
                        <div className="w-4 h-4 rounded-full bg-white"></div>
                      </div>
                      
                      <div className={`w-1/2 ${
                        index % 2 === 0 ? 'pl-8' : 'pr-8 text-right'
                      }`}>
                        <div className={`bg-white p-6 rounded-lg shadow-md inline-block ${
                          index % 2 === 0 ? 'rounded-tl-none' : 'rounded-tr-none'
                        }`}>
                          <span className="text-kheops-salmon font-bold text-lg">{milestone.year}</span>
                          <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile timeline carousel */}
              <div className="sm:hidden mb-12">
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentMilestoneIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg mx-4 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-kheops-salmon font-bold text-2xl">
                          {milestones[currentMilestoneIndex].year}
                        </span>
                        <div className="flex space-x-2">
                          {milestones.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentMilestoneIndex(index)} aria-label={`Aller à l'étape ${index + 1}`}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentMilestoneIndex 
                                  ? 'bg-kheops-gold w-4' 
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-kheops-gold to-kheops-salmon bg-clip-text text-transparent">
                        {milestones[currentMilestoneIndex].title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {milestones[currentMilestoneIndex].description}
                      </p>
                      <div className="mt-6 flex justify-between items-center">
                        <button
                          onClick={() => setCurrentMilestoneIndex((prev) => (prev - 1 + milestones.length) % milestones.length)} aria-label="Étape précédente"
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setCurrentMilestoneIndex((prev) => (prev + 1) % milestones.length)} aria-label="Étape suivante"
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16 bg-gray-50">
            <div className="container-custom">
              <motion.div 
                className="text-center max-w-3xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Notre <span className="text-kheops-gold">Équipe</span></h2>
                <p className="text-gray-600">
                  Des professionnels passionnés qui font vivre KHEOPS SET DIGITAL au quotidien.
                </p>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {teamMembers.map((member) => (
                  <motion.div 
                    key={member.id}
                    variants={fadeIn} 
                    className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative overflow-hidden h-80">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <p className="text-white text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {member.bio}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                          {member.expertise.map((skill, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 text-xs font-medium bg-white/10 text-white rounded-full backdrop-blur-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                          <SocialIcon network="twitter" member={member.id} url="#" showIcon={shouldShowSocial(member.id, 'twitter')} />
                          <SocialIcon network="instagram" member={member.id} url="#" showIcon={shouldShowSocial(member.id, 'instagram')} />
                          <SocialIcon network="linkedin" member={member.id} url="#" showIcon={shouldShowSocial(member.id, 'linkedin')} />
                        </div>
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                      <p className="text-kheops-salmon font-medium">{member.role}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-white">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto bg-gradient-to-br from-kheops-gold to-kheops-salmon rounded-lg overflow-hidden shadow-xl">
                <div className="p-8 md:p-12 text-white text-center">
                  <h2 className="text-3xl font-bold mb-6">Prêt à Travailler Avec Nous?</h2>
                  <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                    Contactez-nous dès aujourd'hui pour discuter de votre projet et découvrir comment notre équipe peut vous aider à atteindre vos objectifs digitaux.
                  </p>
                  <div className="flex justify-center">
                    <Link 
                      to="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white hover:bg-white/10"
                      onClick={() => ReactGA.event({ category: 'AproposPage', action: 'Click NousContacter', label: 'Nous contacter' })}
                    >
                      Nous contacter
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Apropos; 