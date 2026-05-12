import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Check } from 'lucide-react';
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { contactFormSchema, ContactFormValues } from '@/schemas/contactFormSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import '../../styles/inputAnimations.css';
import ReactGA from 'react-ga4';

const ContactForm = () => {

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    },
  });
  const { handleSubmit, control, reset, formState: { isValid } } = form;
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // Fetch IP and location metadata
      const ipRes = await fetch('https://ipapi.co/json/');
      const ipData = ipRes.ok ? await ipRes.json() : {};
      const metadata = {
        ip: ipData.ip,
        city: ipData.city,
        region: ipData.region,
        country: ipData.country_name,
        latitude: ipData.latitude,
        longitude: ipData.longitude,
        userAgent: navigator.userAgent,
        language: navigator.language,
        pageUrl: window.location.href,
        formTitle: 'Formulaire de contact - Page Contact',
      };
      // Send form data and metadata to Formspree
      const response = await fetch('https://formspree.io/f/xwplbrgv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, metadata }),
      });
      if (!response.ok) throw new Error('Envoi échoué');
      toast.success('Message envoyé !', { description: 'Nous vous répondrons bientôt.' });
      setFormSubmitted(true);
      reset();
    } catch (err) {
      console.error(err);
      toast.error('Erreur', { description: 'Impossible d\'envoyer le message.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (formSubmitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="text-green-600" size={40} /></div>
        <h4 className="text-2xl font-bold mb-2">Message envoyé !</h4>
        <p className="text-gray-600 mb-6">Merci de nous avoir contacté.</p>
        <Button className="bg-gradient-to-r from-kheops-gold to-kheops-salmon text-white" onClick={() => { setFormSubmitted(false); ReactGA.event({ category: 'ContactPage', action: 'Click EnvoyerAutreMessage', label: 'Envoyer un autre message' }); }}>Envoyer un autre message</Button>
      </motion.div>
    );
  }

  return (
    <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-kheops-gold to-kheops-salmon text-white p-6">
        <CardTitle className="text-2xl font-bold">Envoyez-nous un message</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={control} name="firstName" render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Prénom <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      {...field}
                      className={cn(
                        'inputColorAnimation',
                        fieldState.invalid ? 'input-error' : fieldState.isTouched ? 'input-success' : 'input-default'
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="lastName" render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Nom <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      {...field}
                      className={cn(
                        'inputColorAnimation',
                        fieldState.invalid ? 'input-error' : fieldState.isTouched ? 'input-success' : 'input-default'
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="email" render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                      className={cn(
                        'inputColorAnimation',
                        fieldState.invalid ? 'input-error' : fieldState.isTouched ? 'input-success' : 'input-default'
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="subject" render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Sujet <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Votre sujet"
                      {...field}
                      className={cn(
                        'inputColorAnimation',
                        fieldState.invalid ? 'input-error' : fieldState.isTouched ? 'input-success' : 'input-default'
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={control} name="message" render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Message <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Textarea
                    className={cn(
                      'h-40',
                      'inputColorAnimation',
                      fieldState.invalid ? 'input-error' : fieldState.isTouched ? 'input-success' : 'input-default'
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={!isValid || isSubmitting} className="w-full bg-gradient-to-r from-kheops-gold to-kheops-salmon text-white flex justify-center py-4"
              onClick={() => ReactGA.event({ category: 'ContactPage', action: 'Click EnvoyerMessage', label: 'Envoyer le message' })}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
