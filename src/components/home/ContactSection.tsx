
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les meilleurs délais.",
        variant: "default",
      });
    }, 1500);
  };

  return (
    <section className="section-padding bg-kheops-lightGray" id="contact">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">Contactez <span className="text-kheops-gold">Nous</span></h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Une question, un projet ? N'hésitez pas à nous contacter. Notre équipe vous répondra dans les meilleurs délais.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Envoyez-nous un message</h3>
            
            {formSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} className="text-green-600" />
                </div>
                <h4 className="text-2xl font-bold mb-2">Message envoyé !</h4>
                <p className="text-gray-600 mb-6">
                  Merci de nous avoir contacté. Notre équipe vous répondra dans les meilleurs délais.
                </p>
                <Button 
                  className="bg-kheops-gold hover:bg-kheops-salmon text-white"
                  onClick={() => setFormSubmitted(false)}
                >
                  Envoyer un autre message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">Nom complet</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className="border-gray-300 focus:border-kheops-gold focus:ring-kheops-gold"
                      required
                      value={formState.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="border-gray-300 focus:border-kheops-gold focus:ring-kheops-gold"
                      required
                      value={formState.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+33 6 12 34 56 78"
                      className="border-gray-300 focus:border-kheops-gold focus:ring-kheops-gold"
                      value={formState.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-700">Sujet</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Votre sujet"
                      className="border-gray-300 focus:border-kheops-gold focus:ring-kheops-gold"
                      required
                      value={formState.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <Label htmlFor="message" className="text-gray-700">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Votre message..."
                    className="h-40 border-gray-300 focus:border-kheops-gold focus:ring-kheops-gold"
                    required
                    value={formState.message}
                    onChange={handleChange}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-kheops-gold hover:bg-kheops-salmon text-white flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Envoyer le message
                      <Send size={16} className="ml-2" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-6">Informations de contact</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-kheops-gold bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-kheops-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Adresse</h4>
                    <p className="text-gray-600">123 Avenue du Digital, 75000 Paris, France</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-kheops-gold bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-kheops-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Téléphone</h4>
                    <p className="text-gray-600">+33 1 23 45 67 89</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-kheops-gold bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-kheops-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Email</h4>
                    <p className="text-gray-600">contact@kheops-set.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Horaires d'ouverture</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lundi - Vendredi</span>
                  <span className="font-semibold">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Samedi</span>
                  <span className="font-semibold">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimanche</span>
                  <span className="font-semibold text-kheops-salmon">Fermé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
