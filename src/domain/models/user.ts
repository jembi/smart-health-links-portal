import z from 'zod';

import { BaseModel } from './base-model';

export class UserModel extends BaseModel {
  constructor(
    private userId: string,
    private patientId: string,
    private id?: string,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {
    super(
      z.object({
        userId: z.string().min(1),
        patientId: z.string().min(1),
        id: z.string().optional(),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional()
      }),
    );
    this.validate();
  }

  getId(): string | undefined {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getPatientId(): string {
    return this.patientId;
  }

  getUserId(): string {
    return this.userId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }
}
