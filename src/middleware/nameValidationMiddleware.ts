import { z } from 'zod';
import { nameSchema } from '../utils/nameValidation';

export const validateNameMiddleware = (req: any, res: any, next: any) => {
  const { firstName, lastName } = req.body;

  try {
    // Valider le prénom
    if (firstName) {
      nameSchema.parse(firstName);
    }
    
    // Valider le nom
    if (lastName) {
      nameSchema.parse(lastName);
    }
    
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors.map(err => err.message)
      });
    }
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};
