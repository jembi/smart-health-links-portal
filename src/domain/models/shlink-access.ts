import z from 'zod';

import { BaseModel } from './base-model';

export class SHLinkAccessModel extends BaseModel {
  constructor(
    private shlinkId: string,
    private accessTime: Date,
    private recipient: string,
    private id?: string,
  ) {
    super(
      z.object({
        shlinkId: z.string().min(1),
        id: z.string().optional(),
        access_time: z.date().default(new Date()),
        recipient: z.string().min(1),
      }),
    );
    this.validate();
  }

  getRecipient(): string {
    return this.recipient;
  }

  setRecipient(recipient: string): void {
    this.recipient = recipient;
  }

  getAccessTime(): Date {
    return this.accessTime;
  }

  setAccessTime(accessTime: Date): void {
    this.accessTime = accessTime;
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
}
