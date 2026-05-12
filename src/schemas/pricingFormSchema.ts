import { z } from 'zod';
import { PricingPlan, PricingPeriod } from "@/types/pricing";
import { nameSchema, firstNameSchema } from "@/utils/nameValidation";
import {
  parsePhoneNumberFromString,
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  validatePhoneNumberLength,
  CountryCode as LibCountryCode,
} from 'libphonenumber-js/min';

export const pricingFormSchema = z.object({
  firstName: firstNameSchema,
  lastName: nameSchema,
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  phone: z.string().min(1, { message: "Le numéro de téléphone est requis." }), // Expecting E.164 format
  message: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions générales pour continuer.",
  }),
  selectedPlan: z.enum(["Starter", "Pro", "Premium"]).optional(),
  selectedPeriod: z.enum(["monthly", "quarterly", "yearly"]).optional(),
  initialPrice: z.number().optional(),
})
.superRefine((data, ctx) => {
  if (data.phone) {
    const phoneNumber = parsePhoneNumberFromString(data.phone);

    if (!phoneNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: "Format du numéro de téléphone invalide.",
      });
      return;
    }

    const countryCode = phoneNumber.country;

    if (!countryCode) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['phone'],
            message: "Impossible de déterminer le pays du numéro de téléphone.",
        });
        return;
    }

    if (!isPossiblePhoneNumber(data.phone, countryCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: "Ce numéro de téléphone ne semble pas possible.",
      });
      return;
    }

    if (!isValidPhoneNumber(data.phone, countryCode)) {
      const lengthValidation = validatePhoneNumberLength(data.phone, countryCode);
      let message = "Numéro de téléphone invalide.";
      if (lengthValidation === 'TOO_SHORT') {
        message = "Le numéro de téléphone est trop court.";
      } else if (lengthValidation === 'TOO_LONG') {
        message = "Le numéro de téléphone est trop long.";
      } else if (lengthValidation === 'INVALID_COUNTRY') {
        message = "Le code pays ne correspond pas au numéro.";
      }
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: message,
      });
      return;
    }

    const type = phoneNumber.getType();
    const isValidType = type === 'MOBILE' || type === 'FIXED_LINE_OR_MOBILE';
    const isCameroonSpecialCase = countryCode === 'CM' && phoneNumber.nationalNumber.startsWith('6') && type === undefined && phoneNumber.isValid();
    const isOtherCountrySpecialCase = countryCode !== 'CM' && type === undefined && phoneNumber.isValid();

    if (!(isValidType || isCameroonSpecialCase || isOtherCountrySpecialCase)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: "Ce type de numéro n'est pas accepté (ex: mobile ou fixe)."
      });
    }
  }
});

export type PricingFormValues = z.infer<typeof pricingFormSchema>;