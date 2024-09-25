import z from 'zod';

import { BaseModel } from './base-model';

export class UserModel extends BaseModel {
  constructor(
    private userId: string,
    private patientId: string,
    private id?: string,
    private serverConfigId?: string,
  ) {
    super(
      z.object({
        userId: z.string().min(1),
        patientId: z.string().min(1),
        id: z.string().optional(),
        serverConfigId: z.string().optional(),
      }),
    );
    this.validate();
  }

  getServerConfigId(): string | undefined {
    return this.serverConfigId;
  }

  setServerConfigId(serverConfigId: string): void {
    this.serverConfigId = serverConfigId;
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
}
