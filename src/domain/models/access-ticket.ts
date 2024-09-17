import z from 'zod';

import { BaseModel } from './base-model';

export class AccessTicketModel extends BaseModel {
  constructor(
    private shlinkId: string,
    private id?: string,
  ) {
    super(
      z.object({
        shlinkId: z.string().min(1),
        id: z.string().nullable().optional(),
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
}
