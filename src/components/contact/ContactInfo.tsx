import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import ReactGA from 'react-ga4';

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-kheops-salmon to-kheops-gold text-white p-6">
          <CardTitle className="text-2xl font-bold">Informations de contact</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            <ContactInfoItem 
              icon={<MapPin className="h-6 w-6 text-kheops-gold" />}
              title="Adresse"
              text="Logpom, Douala, Cameroun"
              delay={0.1}
            />
            <ContactInfoItem 
              icon={<Phone className="h-6 w-6 text-kheops-gold" />}
              title="Téléphone"
              text="+237 612 345 678"
              delay={0.2}
            />
            <ContactInfoItem 
              icon={<Mail className="h-6 w-6 text-kheops-gold" />}
              title="Email"
              text="ksd@kheopsetdigital.com"
              delay={0.3}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-kheops-gold to-kheops-salmon text-white p-6">
          <CardTitle className="text-2xl font-bold">Horaires d'ouverture</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <OpeningHoursItem day="Lundi - Vendredi" hours="9:00 - 18:00" delay={0.1} />
            <OpeningHoursItem day="Samedi" hours="10:00 - 14:00" delay={0.2} />
            <OpeningHoursItem day="Dimanche" hours="Fermé" closed delay={0.3} />
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 italic text-sm">
              * Nous sommes également disponibles sur rendez-vous en dehors de ces horaires
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ContactInfoItem = ({ 
  icon, 
  title, 
  text,
  delay
}: { 
  icon: React.ReactNode; 
  title: string; 
  text: string;
  delay: number;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-start"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-kheops-gold/20 to-kheops-salmon/20 rounded-full flex items-center justify-center mr-4">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-800 text-lg">{title}</h4>
        <p className="text-gray-600">{text}</p>
      </div>
    </motion.div>
  );
};

const OpeningHoursItem = ({ 
  day, 
  hours, 
  closed = false,
  delay
}: { 
  day: string; 
  hours: string; 
  closed?: boolean;
  delay: number;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex justify-between py-2 border-b border-gray-100 last:border-0"
    >
      <span className="text-gray-600 font-medium">{day}</span>
      <span className={`font-semibold ${closed ? 'text-kheops-salmon' : 'text-kheops-gold'}`}>
        {hours}
      </span>
    </motion.div>
  );
};

export default ContactInfo;
