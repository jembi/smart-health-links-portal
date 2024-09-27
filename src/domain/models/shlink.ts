import z from 'zod';

import { BaseModel } from './base-model';

export class SHLinkModel extends BaseModel {
  constructor(
    private userId: string,
    private name: string,
    private passcodeFailuresRemaining?: number,
    private active?: boolean,
    private managementToken?: string,
    private configPasscode?: string,
    private configExp?: Date,
    private id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(
      z.object({
        userId: z.string().min(10),
        passcodeFailuresRemaining: z.number().default(5).optional(),
        active: z.boolean().optional(),
        managementToken: z.string().min(10).optional(),
        configPasscode: z.string().min(4).optional().nullable(),
        configExp: z.date().optional().nullable(),
        id: z.string().optional(),
        name: z.string().default('unnamed shlink'),
      }),
      createdAt,
      updatedAt
    );
    this.validate();
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getId(): string | undefined {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getPasscodeFailuresRemaining(): number {
    return this.passcodeFailuresRemaining;
  }

  setPasscodeFailuresRemaining(passcodeFailuresRemaining: number): void {
    this.passcodeFailuresRemaining = passcodeFailuresRemaining;
  }

  getConfigPasscode(): string | undefined {
    return this.configPasscode;
  }

  setConfigPasscode(configPasscode: string | undefined): void {
    this.configPasscode = configPasscode;
  }

  getConfigExp(): Date | undefined {
    return this.configExp;
  }

  setConfigExp(configExp: Date | undefined): void {
    this.configExp = configExp;
  }

  getActive(): boolean {
    return this.active;
  }

  setActive(active: boolean): void {
    this.active = active;
  }

  getManagementToken(): string {
    return this.managementToken;
  }

  setManagementToken(managementToken: string): void {
    this.managementToken = managementToken;
  }

  getUserId(): string {
    return this.userId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }
}
