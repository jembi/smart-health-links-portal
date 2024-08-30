import { SHLinkEndpointEntity } from '@/entities/shlink-endpoint';
import { BasePrismaRepository } from './base-repository';
import { PrismaClient } from '@prisma/client';
import { ISHLinkEndpointRepository } from '../interfaces/shlink-endpoint-repository';

export class SHLinkEndpointPrismaRepository
  extends BasePrismaRepository<SHLinkEndpointEntity>
  implements ISHLinkEndpointRepository
{
  constructor(prismaClient: PrismaClient) {
    super(prismaClient, 'shlink_endpoint');
  }
}
