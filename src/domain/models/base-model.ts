import z, { ZodObject, ZodRawShape } from 'zod';


export class ModelValidationError extends Error {
  constructor(
    message: string,
    public errors: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ModelValidationError';
  }
}

export abstract class BaseModel {
  public createdAt?: Date;
  public updatedAt?: Date;

  private static _baseSchema = z.object({
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  });

  constructor(private _schema: ZodObject<ZodRawShape>, createdAt?:Date, updatedAt?: Date) {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validate() {
    const combinedSchema = BaseModel._baseSchema.merge(this._schema);

    const result = combinedSchema.safeParse(this);

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.errors.forEach((err) => {
        if (!errors[err.path[0]]) {
          errors[err.path[0]] = [];
        }
        errors[err.path[0]].push(err.message);
      });

      throw new ModelValidationError('Validation failed', errors);
    }
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }

}
