import { Button } from '@/components/ui/button';
import { motion, useInView } from 'framer-motion';
import { Users, ClipboardCheck, Award, Calendar } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';

interface TeamMemberProps {
  image: string;
  name: string;
  role: string;
  delay: number;
}

const TeamMember = ({ image, name, role, delay }: TeamMemberProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      viewport={{ once: true }}
      className="relative group"
    >
      <div className="overflow-hidden rounded-full w-48 h-48 mx-auto mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
      </div>
      <div className="text-center">
        <h4 className="font-poppins font-semibold text-xl">{name}</h4>
        <p className="text-kheops-salmon">{role}</p>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-kheops-gold transition-all duration-300 group-hover:w-1/2"></div>
      </div>
    </motion.div>
  );
};

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const teamMembers = [
    {
      image: "/images/team/opportun-aby.jpg",
      name: "Opportun ABY",
      role: "Fondateur & CEO"
    },
    {
      image: "/images/team/martine-fokam.jpg",
      name: "Martine FOKAM",
      role: "Directrice Artistique"
    },
    {
      image: "/images/team/kofi-mensah.jpg",
      name: "Kofi MENSAH",
      role: "Directeur Technique"
    },
    {
      image: "/images/team/edwige-njona.jpg",
      name: "Edwige NJONA",
      role: "Community Manager"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-r from-kheops-lightGray to-white" id="about">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">À Propos de <span className="text-kheops-gold">Nous</span></h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Une équipe passionnée dédiée à révolutionner votre présence digitale avec créativité et expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div ref={ref}>
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold mb-6"
            >
              Notre <span className="text-kheops-gold">Histoire</span>
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600 mb-4"
            >
              Fondée en 2020, KHEOPS SET DIGITAL est née d'une vision simple mais puissante : redéfinir les standards de la communication digitale en combinant stratégie, créativité et technologie.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-600 mb-6"
            >
              Aujourd'hui, notre équipe de passionnés accompagne des entreprises de toutes tailles dans leur transformation digitale, avec une approche sur mesure qui place vos objectifs au cœur de notre stratégie.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/apropos">
                <Button className="bg-kheops-gold hover:bg-kheops-salmon text-white"
                  onClick={() => ReactGA.event({ category: 'AboutSection', action: 'Click About', label: 'En savoir plus' })}>
                  En savoir plus
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:gap-12 mt-8 lg:mt-0">
            <div className="text-center p-6 rounded-lg bg-white shadow-lg transform rotate-3">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-kheops-gold text-white mx-auto mb-4">
                <Users size={24} />
              </div>
              <h4 className="font-bold text-2xl mb-2">+90</h4>
              <p className="text-gray-600">Clients satisfaits</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white shadow-lg transform -rotate-3">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-kheops-salmon text-white mx-auto mb-4">
                <ClipboardCheck size={24} />
              </div>
              <h4 className="font-bold text-2xl mb-2">+200</h4>
              <p className="text-gray-600">Projets réalisés</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white shadow-lg transform -rotate-2">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-kheops-salmon text-white mx-auto mb-4">
                <Award size={24} />
              </div>
              <h4 className="font-bold text-2xl mb-2">+10</h4>
              <p className="text-gray-600">Experts passionnés</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white shadow-lg transform rotate-2">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-kheops-gold text-white mx-auto mb-4">
                <Calendar size={24} />
              </div>
              <h4 className="font-bold text-2xl mb-2">+5</h4>
              <p className="text-gray-600">Années d'expérience</p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Notre <span className="text-kheops-gold">Équipe</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                image={member.image}
                name={member.name}
                role={member.role}
                delay={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
