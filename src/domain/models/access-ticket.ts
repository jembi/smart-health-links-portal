import z from 'zod';

import { BaseModel } from './base-model';

export class AccessTicketModel extends BaseModel {
  constructor(
    private shlinkId: string,
    private id?: string,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {
    super(
      z.object({
        shlinkId: z.string().min(1),
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

  getSHLinkId(): string {
    return this.shlinkId;
  }

  setSHLinkId(shlinkId: string): void {
    this.shlinkId = shlinkId;
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
