import { PrismaClient } from '@prisma/client';

import { UserEntity } from '@/entities/user';

import { BasePrismaRepository } from './base-repository';

export class UserPrismaRepository extends BasePrismaRepository<UserEntity> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient, 'user');
  }
}
