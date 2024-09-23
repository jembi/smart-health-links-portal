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

interface SHLinkParameters {
    status?: string;
}

export const validateSHLinkStatusParameter = (parameters: SHLinkParameters) => {
    const statusSchema = z.enum(['expired', 'active', 'inactive']).nullable();

    const result = statusSchema.safeParse(parameters.status || null);
    
    if (!result.success) {
        throw new ParameterValidationError('Invalid status parameter', {
        status: result.error.errors.map((err) => err.message),
        });
    }
};