import { ServerConfigEntity } from '@/entities/server_config';
import { BasePrismaRepository } from './base-repository';
import { PrismaClient } from '@prisma/client';
import { IServerConfigRepository } from '../interfaces/server-config-repository';

export class ServerConfigPrismaRepository
  extends BasePrismaRepository<ServerConfigEntity>
  implements IServerConfigRepository
{
  constructor(prismaClient: PrismaClient) {
    super(prismaClient, 'server_config');
  }
}
