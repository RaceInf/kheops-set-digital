import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomCountrySelect from './CustomCountrySelect';
import { Loader2, Check } from "lucide-react";
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // Assurez-vous que ce chemin est correct
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PricingPlan, PricingPeriod } from '@/types/pricing';
import { pricingFormSchema, type PricingFormValues } from '@/schemas/pricingFormSchema';
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumberFromString, getCountryCallingCode, type CountryCode } from 'libphonenumber-js';
import countryNames from 'react-phone-number-input/locale/fr.json';
import 'react-phone-number-input/style.css';
import '../../styles/inputAnimations.css';
import ReactGA from 'react-ga4';

/* Veuillez vous assurer que pour chaque élément <input> du formulaire, on ajoute la classe 'inputColorAnimation' combinée à :
 - 'input-error' si le champ présente une erreur,
 - 'input-success' si le champ est validé,
 - 'input-default' pour l'état normal.
Cela permettra d'avoir une animation de couleur identique et centralisée sur tous les états, que ce soit en cas d'échec, de réussite ou autre.*/

// Define a stable input component that forwards the ref
const StableForwardRefInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return <Input {...props} ref={ref} />;
});

const LOCAL_STORAGE_KEY = "pricingFormData"; // Consistent key for localStorage

interface PricingContactFormProps {
  initialPlan?: PricingPlan;
  initialPeriod?: PricingPeriod;
  initialPrice?: number;
  onSuccess?: () => void;
}

const PricingContactForm = ({ initialPlan, initialPeriod, initialPrice, onSuccess }: PricingContactFormProps) => {
  const [defaultCountry, setDefaultCountry] = useState<CountryCode>('CM');
  const { formatPrice, currency } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status

  const [browserInfo, setBrowserInfo] = useState<string>('');
  const [phoneCountryDisplay, setPhoneCountryDisplay] = useState<string>(defaultCountry);

  useEffect(() => {
    setBrowserInfo(navigator.userAgent);
  }, []);

  // Detect visitor location via ipapi.co (same method as NewsletterSection)
  const getVisitorLocation = async () => {
    try {
      const resp = await fetch('https://ipapi.co/json/');
      const data = await resp.json();
      return {
        country: data.country_name,
        countryCode: data.country_code,
        city: data.city,
        region: data.region
      };
    } catch (e) {
      console.error('Erreur détection localisation:', e);
      return { country: 'Inconnu', countryCode: 'XX', city: 'Inconnu', region: 'Inconnu' };
    }
  };

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(pricingFormSchema),
    mode: "all",
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '', // This will store the E.164 phone number
      message: '',
      acceptTerms: false,
      selectedPlan: initialPlan,
      selectedPeriod: initialPeriod,
      initialPrice: initialPrice,
    },
  });

  // Set default country from localStorage on mount
  useEffect(() => {
    const lastUsedCountry = localStorage.getItem('lastUsedCountry');
    if (lastUsedCountry) {
      // Check if the stored country code is a valid CountryCode
      try {
        // This will throw if the country code is invalid
        const phoneNumber = parsePhoneNumberFromString(`+${lastUsedCountry}1`, { defaultCountry: lastUsedCountry as CountryCode });
        if (phoneNumber && phoneNumber.country) {
          setDefaultCountry(phoneNumber.country);
        }
      } catch (e) {
        console.warn('Invalid country code in localStorage:', lastUsedCountry);
      }
    }
  }, []);

  // The functionality to load form data from localStorage on mount has been disabled as per user request.
  // useEffect(() => {
  //   const savedFormData = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   if (savedFormData) {
  //     try {
  //       const parsedData = JSON.parse(savedFormData) as PricingFormValues;
  //       form.reset({
  //         ...form.getValues(), // Preserve current form state as base
  //         ...parsedData,       // Override with saved data
  //       });
  //     } catch (error) {
  //       console.error("Failed to parse pricing form data from localStorage:", error);
  //     }
  //   }
  // }, [form]);

  // The functionality to save form data to localStorage has been disabled as per user request.
  // useEffect(() => {
  //   const subscription = form.watch((value) => {
  //     if (isSubmitted) {
  //       return; // Don't save to localStorage if the form has been successfully submitted
  //     }
  //     const formDataToSave = { ...value };
  //     // Ensure all fields are included, even if undefined initially in form state but present in PricingFormValues
  //     const allKnownKeys: Array<keyof PricingFormValues> = [
  //       'firstName', 'lastName', 'email', 'phone', 'message', 
  //       'acceptTerms', 'selectedPlan', 'selectedPeriod', 'initialPrice'
  //     ];
  //     allKnownKeys.forEach(key => {
  //       if (!(key in formDataToSave)) {
  //         (formDataToSave as any)[key] = form.getValues(key);
  //       }
  //     });
  //     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formDataToSave));
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form, isSubmitted]);

  const onSubmit = async (data: PricingFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      const locationData = await getVisitorLocation();
      const phoneNumber = parsePhoneNumberFromString(data.phone);
      const phoneCountryCode = phoneNumber?.country;
      
      const phoneCountryName = phoneCountryCode ? (countryNames as Record<CountryCode, string>)[phoneCountryCode] : 'Inconnu';

      // Special Formspree fields for email routing and subject
      formData.append('_replyto', data.email);
      formData.append('_subject', `Soumission: ${data.selectedPlan || 'Formule non spécifiée'} par ${data.firstName} ${data.lastName}`);

      // Group 1: Personal Info
      formData.append('1.0_📋 Prénom', data.firstName);
      formData.append('1.1_Nom', data.lastName);
      formData.append('1.2_Email', data.email);
      formData.append('1.3_Téléphone', data.phone);
      formData.append('1.4_Pays du téléphone', `${phoneCountryName} (${phoneCountryCode || 'N/A'})`);

      // Group 2: Geolocation
      formData.append('2.0_🌍 Pays (détecté)', locationData.country);
      formData.append('2.1_Ville (détectée)', locationData.city);
      formData.append('2.2_Région (détectée)', locationData.region);
      
      if (phoneCountryCode && locationData.countryCode !== 'XX' && phoneCountryCode !== locationData.countryCode) {
        formData.append('2.3_⚠️ Incohérence de localisation', `Le pays du téléphone (${phoneCountryName} - ${phoneCountryCode}) ne correspond pas au pays détecté (${locationData.country} - ${locationData.countryCode}).`);
      }

      // Group 3: Message
      if (data.message) {
        formData.append('3.0_Message', data.message);
      }

      // Group 4: Consent
      formData.append('4.0_✅ Conditions acceptées', data.acceptTerms ? 'Oui' : 'Non');

      // Group 5: Subscription
      formData.append('5.0_💳 Formule choisie', data.selectedPlan || 'Non spécifiée');
      formData.append('5.1_Période choisie', data.selectedPeriod || 'Non spécifiée');
      formData.append('5.2_Prix de l\'offre', formatPrice(initialPrice ?? 0));
      formData.append('5.3_Devise', currency);

      // Group 6: Browser Info
      formData.append('6.0_User-Agent', browserInfo);
      const response = await fetch("https://formspree.io/f/xwplbrgv", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success("Message envoyé", {
          description: "Votre message a été envoyé avec succès.",
        });
        if (onSuccess) {
          onSuccess();
        }
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
          acceptTerms: false,
          selectedPlan: initialPlan,
          selectedPeriod: initialPeriod,
          initialPrice,
          phone: "",
        });
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        const phoneNumber = parsePhoneNumberFromString(data.phone, { defaultCountry });
        if (phoneNumber && phoneNumber.country) {
          localStorage.setItem('lastUsedCountry', phoneNumber.country);
          setDefaultCountry(phoneNumber.country);
        }
      } else {
        throw new Error("Une erreur s'est produite lors de l'envoi du formulaire");
      }
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de l'envoi du message.",
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPeriodLabel = () => {
    switch (form.watch('selectedPeriod')) {
      case "monthly": return "mensuel";
      case "quarterly": return "trimestriel";
      case "yearly": return "annuel";
      default: return "mensuel";
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 px-6"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="text-green-600" size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2">Souscription confirmée !</h3>
        <p className="text-gray-600 mb-6">
          Merci pour votre confiance. Notre équipe vous contactera dans les plus brefs délais pour finaliser votre souscription.
        </p>
        <Button 
          onClick={() => setIsSubmitted(false)}
          className="bg-kheops-gold hover:bg-kheops-salmon"
        >
          Nouvelle souscription
        </Button>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Prénom<span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Entrez votre prénom" 
                    {...field}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      const trimmed = rawValue.trim();
                      const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
                      field.onChange(capitalized); // Envoie la valeur transformée à react-hook-form
                    }}
                    className={cn(
                      "h-10 bg-white/50",
                      fieldState.invalid 
                        ? "border-red-500 text-red-700 focus:border-red-500 focus:ring-red-500/20 placeholder:text-red-300/70" 
                        : (fieldState.isTouched && !fieldState.invalid)
                        ? "border-green-500 text-green-800 focus:border-green-500 focus:ring-green-500/20 placeholder:text-green-700/70" 
                        : "border-gray-200 focus:border-kheops-gold focus:ring-kheops-gold/20"
                    )}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Nom<span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Entrez votre nom" 
                    {...field} 
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      const trimmed = rawValue.trim();
                      const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
                      field.onChange(capitalized); // Envoie la valeur transformée à react-hook-form
                    }}
                    className={cn(
                      "h-10 bg-white/50",
                      fieldState.invalid 
                        ? "border-red-500 text-red-700 focus:border-red-500 focus:ring-red-500/20 placeholder:text-red-300/70" 
                        : (fieldState.isTouched && !fieldState.invalid)
                        ? "border-green-500 text-green-800 focus:border-green-500 focus:ring-green-500/20 placeholder:text-green-700/70" 
                        : "border-gray-200 focus:border-kheops-gold focus:ring-kheops-gold/20"
                    )}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Email<span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez votre adresse email"
                    {...field}
                    className={cn(
                      "h-10 bg-white/50",
                      fieldState.invalid
                        ? "border-red-500 text-red-700 placeholder:text-red-300/70 focus:border-red-500 focus:ring-red-500/20"
                        : fieldState.isTouched
                          ? "border-green-500 text-green-800 placeholder:text-green-700/70 focus:border-green-500 focus:ring-green-500/20"
                          : "border-gray-200 focus:border-kheops-gold focus:ring-kheops-gold/20"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Téléphone<span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <PhoneInput
                    international
                    defaultCountry={defaultCountry}
                    onCountryChange={(c?: CountryCode) => {
                      if (c) {
                        // Update selected country and reset phone
                        setDefaultCountry(c);
                        form.setValue('phone', '', { shouldValidate: true, shouldDirty: true });
                        setPhoneCountryDisplay('');
                      }
                    }}
                    placeholder="Entrez votre numéro de téléphone"
                    value={field.value as string | undefined}
                    onChange={(val?: string) => {
                      field.onChange(val || '');
                      const phoneNumber = parsePhoneNumberFromString(val || '', { defaultCountry });
                      if (phoneNumber && phoneNumber.country) {
                        const countryName = (countryNames as Record<CountryCode, string>)[phoneNumber.country];
                        setPhoneCountryDisplay(countryName || '');
                      } else {
                        setPhoneCountryDisplay('');
                      }
                    }}
                    onBlur={field.onBlur}
                    disabled={isSubmitting}
                    countrySelectComponent={CustomCountrySelect}
                    inputComponent={StableForwardRefInput}
                    buttonClassName={cn(
                      "flex items-center h-10 px-3 bg-gray-100 rounded-l-lg focus:outline-none focus:ring-0",
                      fieldState.invalid
                        ? "border-red-500"
                        : fieldState.isTouched
                          ? "border-green-500"
                          : "border-gray-300"
                    )}
                    inputClassName={cn(
                      "flex-1 h-10 px-4 bg-white rounded-r-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-0",
                      fieldState.invalid
                        ? "border-red-500 text-red-700 focus:border-red-500 focus:ring-red-500/20"
                        : fieldState.isTouched
                          ? "border-green-500 text-green-800 focus:border-green-500 focus:ring-green-500/20"
                          : "border-gray-300 focus:border-kheops-gold focus:ring-kheops-gold/20"
                    )}
                    className={cn(
                      "flex w-full space-x-1 rounded-lg bg-white shadow-sm",
                      fieldState.invalid
                        ? "border border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20"
                        : fieldState.isTouched
                          ? "border border-green-500 focus-within:border-green-500 focus-within:ring-green-500/20"
                          : "border border-gray-200 focus-within:border-kheops-gold focus-within:ring-kheops-gold/20"
                    )}
                    numberInputProps={{
                      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                        const input = e.currentTarget as HTMLInputElement;
                        const dial = getCountryCallingCode(defaultCountry);
                        const prefix = `+${dial}`;
                        const pos = input.selectionStart ?? 0;
                        if ((e.key === 'Backspace' && pos <= prefix.length) ||
                            (e.key === 'Delete' && pos < prefix.length)) {
                          e.preventDefault();
                        }
                      },
                      onInput: (e: React.FormEvent<HTMLInputElement>) => {
                        const input = e.currentTarget as HTMLInputElement;
                        const dial = getCountryCallingCode(defaultCountry);
                        const prefix = `+${dial}`;
                        if (!input.value.startsWith(prefix)) {
                          const stripped = input.value.replace(/^\+?\d*/, '');
                          input.value = prefix + stripped;
                          input.setSelectionRange(prefix.length, prefix.length);
                        }
                      },
                      onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        const input = e.currentTarget as HTMLInputElement;
                        const dial = getCountryCallingCode(defaultCountry);
                        const prefix = `+${dial}`;
                        const paste = e.clipboardData.getData('text/plain').replace(/\D/g, '');
                        const newVal = prefix + paste;
                        input.value = newVal;
                        input.setSelectionRange(newVal.length, newVal.length);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">
            Message (optionnel)
          </Label>
          <Textarea
            id="message"
            {...form.register("message")}
            placeholder="Votre message (optionnel)"
            className="h-24 bg-white/50 border-gray-200 focus:border-kheops-gold focus:ring-kheops-gold/20"
          />
        </div>

        <div className="bg-kheops-gold/5 rounded-lg p-6 border border-kheops-gold/20">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Récapitulatif de votre souscription</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Forfait sélectionné</span>
              <span className="font-medium">{form.watch('selectedPlan')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Période</span>
              <span className="font-medium">{getPeriodLabel()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Prix total</span>
              <span className="font-bold text-kheops-gold">{formatPrice(initialPrice ?? 0)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Checkbox
              id="acceptTerms"
              checked={form.watch("acceptTerms")}
              onCheckedChange={(checked) => form.setValue("acceptTerms", checked as boolean)}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="acceptTerms" className="text-sm">
                J'accepte les conditions générales de vente
              </Label>
              <p className="text-xs text-gray-500">
                En soumettant ce formulaire, vous acceptez notre{' '}
                <a href="/politique-de-confidentialite" className="text-kheops-gold underline">politique de confidentialité</a>{' '}
                et nos{' '}
                <a href="/conditions-generales-de-vente" className="text-kheops-gold underline">conditions générales de vente</a>.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !!form.formState.errors.firstName ||
              !!form.formState.errors.lastName ||
              !!form.formState.errors.email ||
              !!form.formState.errors.phone ||
              !form.watch('acceptTerms')
            }
            className={cn(
              "w-full text-white",
              isSubmitting ||
              form.formState.errors.firstName ||
              form.formState.errors.lastName ||
              form.formState.errors.email ||
              form.formState.errors.phone ||
              !form.watch('acceptTerms')
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-kheops-gold hover:bg-kheops-gold/90"
            )}
            onClick={() => ReactGA.event({ category: 'PricingFormPage', action: 'Click EnvoyerSouscription', label: `Souscription ${form.watch('selectedPlan')} - ${form.watch('selectedPeriod')}` })}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Confirmer ma souscription
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PricingContactForm;
