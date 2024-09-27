import { Prisma, PrismaClient } from '@prisma/client';

import { BaseEntity } from '@/entities/base-entity';
import {
  IRepository,
  QueryFilter,
} from '@/infrastructure/repositories/interfaces/repository.interface';

const getPrismaFilters = (filters?: QueryFilter) => {
  return filters as any;
};

export class BasePrismaRepository<T extends BaseEntity>
  implements IRepository<T>
{
  private model: Prisma.ModelName;
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient, model: Prisma.ModelName) {
    this.model = model;
    this.prisma = prisma;
  }

  getModel() {
    const mod = this.model;
    return mod && this.prisma[mod];
  }

  async insert(entity: T): Promise<T> {
    // @ts-ignore
    return this.getModel().create({ data: entity });
  }

  async insertMany(entities: T[]): Promise<T[]> {
    // @ts-ignore
    return this.getModel().createMany({ data: entities });
  }

  async findById(id: string | number): Promise<T> {
    // @ts-ignore
    return this.getModel().findFirst({ where: { id } });
  }

  async findOne(filter: any): Promise<T | undefined> {
    // @ts-ignore
    return this.getModel().findFirst({ where: getPrismaFilters(filter) });
  }

  async findMany(filters?: any): Promise<T[]> {
    // @ts-ignore
    return this.getModel().findMany({ where: getPrismaFilters(filters) });
  }

  async update(entity: T): Promise<T> {
    // @ts-ignore
    return this.getModel().update({ where: { id: entity.id }, data: entity });
  }

  async delete(entity: T): Promise<T> {
    // @ts-ignore
    return this.getModel().delete({ where: { id: entity.id } });
  }
}
