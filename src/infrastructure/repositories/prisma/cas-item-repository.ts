import { PrismaClient } from '@prisma/client';

import { CasItemEntity } from '@/entities/cas-item';

import { BasePrismaRepository } from './base-repository';
import { ICasItemRepository } from '../interfaces/cas-item-repository';

export class CasItemPrismaRepository
  extends BasePrismaRepository<CasItemEntity>
  implements ICasItemRepository
{
  constructor(prismaClient: PrismaClient) {
    super(prismaClient, 'cas_item');
  }
}
