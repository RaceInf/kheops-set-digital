import { z } from 'zod';
import { firstNameSchema, nameSchema } from '@/utils/nameValidation';

export const contactFormSchema = z.object({
  firstName: firstNameSchema,
  lastName: nameSchema,
  email: z.string().email('Email invalide.'),
  subject: z.string().min(1, 'Le sujet est requis.'),
  message: z.string().min(1, 'Le message est requis.'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
