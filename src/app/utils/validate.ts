import { z } from 'zod';

export class ParameterValidationError extends Error {
    constructor(
      message: string,
      public errors: Record<string, string[]>,
    ) {
      super(message);
      this.name = 'ParameterValidationError';
    }
 }
  

export const validateSHLinkStatusParameter = (parameters) => {
    const statusSchema = z.enum(['expired', 'active', 'inactive']);

    const result = statusSchema.safeParse(parameters.status);
    
    if (!result.success) {
        throw new ParameterValidationError('Invalid status parameter', {
        status: result.error.errors.map((err) => err.message),
        });
    }
};