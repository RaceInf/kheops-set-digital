import { z } from 'zod';

// Expression régulière pour valider les noms/prénoms
const nameRegex = /^[a-zA-ZàâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ\s'-]{2,50}$/;

// Schéma Zod pour la validation
export const nameSchema = z.string()
  .min(2, 'Le nom doit contenir au moins 2 caractères.')
  .max(50, 'Le nom ne peut pas dépasser 50 caractères.')
  .regex(nameRegex, {
    message: 'Caractères autorisés : lettres, espaces, tirets (-), apostrophes (\') et caractères accentués'
  })
  .transform(name => {
    console.log('[nameValidation.ts] Original name in transform:', name);
    // Supprimer les espaces en début et fin
    const trimmed = name.trim();
    // Convertir la première lettre en majuscule et le reste en minuscule
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    console.log('[nameValidation.ts] Transformed name:', capitalized);
    return capitalized;
  });

// Schéma Zod pour la validation du prénom
export const firstNameSchema = z.string()
  .min(2, 'Le prénom doit contenir au moins 2 caractères.')
  .max(50, 'Le prénom ne peut pas dépasser 50 caractères.')
  .regex(nameRegex, {
    message: 'Caractères autorisés : lettres, espaces, tirets (-), apostrophes (\') et caractères accentués'
  })
  .transform(name => {
    // Supprimer les espaces en début et fin
    const trimmed = name.trim();
    // Convertir la première lettre en majuscule et le reste en minuscule
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    return capitalized;
  });

// Fonction de validation côté client
export const validateName = (name: string) => {
  try {
    return nameSchema.parse(name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Le nom n\'est pas valide.';
    }
    return 'Une erreur est survenue lors de la validation du nom.';
  }
};

// Fonction de nettoyage du nom
export const cleanName = (name: string) => {
  // Supprimer les espaces en début et fin
  const trimmed = name.trim();
  // Convertir la première lettre en majuscule et le reste en minuscule
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};
