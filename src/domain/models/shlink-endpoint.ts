import z from 'zod';

import { BaseModel } from './base-model';

export class SHLinkEndpointModel extends BaseModel {
  constructor(
    private shlinkId: string,
    private serverConfigId: string,
    private urlPath: string,
    private id?: string,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {
    super(
      z.object({
        shlinkId: z.string(),
        serverConfigId: z.string(),
        urlPath: z.string(),
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

  getShlinkId(): string {
    return this.shlinkId;
  }

  setShlinkId(shlinkId: string): void {
    this.shlinkId = shlinkId;
  }

  getServerConfigId(): string {
    return this.serverConfigId;
  }

  setServerConfigId(serverConfigId: string): void {
    this.serverConfigId = serverConfigId;
  }

  getUrlPath(): string {
    return this.urlPath;
  }

  setUrlPath(urlPath: string): void {
    this.urlPath = urlPath;
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
