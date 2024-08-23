import z from 'zod';

export class ModelValidationError extends Error {
    constructor(message: string, public errors: Record<string, string[]>) {
      super(message);
      this.name = 'ModelValidationError';
    }
  }

export abstract class BaseModel {
    constructor(private _schema: z.ZodSchema) {
    }

    validate(){
        const result = this._schema.safeParse(this);

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.errors.forEach(err => {
        if (!errors[err.path[0]]) {
          errors[err.path[0]] = [];
        }
        errors[err.path[0]].push(err.message);
      });

      throw new ModelValidationError('Validation failed', errors);
    }
  }
}