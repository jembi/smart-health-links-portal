import { PrismaClient } from '@prisma/client';
import { CasItemEntity } from '@/entities/cas-item';
import { CasItemPrismaRepository } from './cas-item-repository';

// Create a mock for PrismaClient
const prismaMock = {
  cas_item: {
    create: jest.fn(),
    createMany: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const entity: CasItemEntity = {
  id: '1',
  hash: 'unique hash',
  content: 'Doe',
  ref_count: 0,
};

describe('CasItemPrismaRepository', () => {
  let repository: CasItemPrismaRepository;

  beforeEach(() => {
    // Instantiate the repository before each test
    repository = new CasItemPrismaRepository(
      prismaMock as unknown as PrismaClient,
    );
  });

  test('should call getModel and create a new entity', async () => {
    prismaMock.cas_item.create.mockResolvedValue(entity);

    const result = await repository.insert(entity);

    expect(prismaMock.cas_item.create).toHaveBeenCalledWith({ data: entity });
    expect(result).toBe(entity);
  });

  test('should call getModel and create many entities', async () => {
    const entities = [
      entity,
      { id: '2', hash: 'Jane Doe', content: 'John Doe', ref_count: 0 },
    ] as CasItemEntity[];
    prismaMock.cas_item.createMany.mockResolvedValue(entities);

    const result = await repository.insertMany(entities);

    expect(prismaMock.cas_item.createMany).toHaveBeenCalledWith({
      data: entities,
    });
    expect(result).toEqual(entities);
  });

  test('should call getModel and find an entity by id', async () => {
    prismaMock.cas_item.findFirst.mockResolvedValue(entity);

    const result = await repository.findById('1');

    expect(prismaMock.cas_item.findFirst).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and find one entity with filter', async () => {
    const filter = { id: '1' };
    prismaMock.cas_item.findFirst.mockResolvedValue(entity);

    const result = await repository.findOne(filter);

    expect(prismaMock.cas_item.findFirst).toHaveBeenCalledWith({
      where: filter,
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and find many entities with filters', async () => {
    const filters = { id: '1' };
    const entities = [entity] as CasItemEntity[];
    prismaMock.cas_item.findMany.mockResolvedValue(entities);

    const result = await repository.findMany(filters);

    expect(prismaMock.cas_item.findMany).toHaveBeenCalledWith({
      where: filters,
    });
    expect(result).toEqual(entities);
  });

  test('should call getModel and update an entity', async () => {
    prismaMock.cas_item.update.mockResolvedValue(entity);

    const result = await repository.update(entity);

    expect(prismaMock.cas_item.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: entity,
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and delete an entity', async () => {
    prismaMock.cas_item.delete.mockResolvedValue(entity);

    const result = await repository.delete(entity);

    expect(prismaMock.cas_item.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toBe(entity);
  });
});
