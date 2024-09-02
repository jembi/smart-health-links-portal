import { PrismaClient } from '@prisma/client';
import { SHLinkAccessPrismaRepository } from './shlink-access-repository';
import { SHLinkAccessEntity } from '@/entities/shlink-access';

// Create a mock for PrismaClient
const prismaMock = {
  shlink_access: {
    create: jest.fn(),
    createMany: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const entity: SHLinkAccessEntity = {
  id: '1',
  recipient: 'unique',
  access_time: new Date(),
  shlink_id: '1',
};

describe('SHLinkAccessPrismaRepository', () => {
  let repository: SHLinkAccessPrismaRepository;

  beforeEach(() => {
    // Instantiate the repository before each test
    repository = new SHLinkAccessPrismaRepository(
      prismaMock as unknown as PrismaClient,
    );
  });

  test('should call getModel and create a new entity', async () => {
    prismaMock.shlink_access.create.mockResolvedValue(entity);

    const result = await repository.insert(entity);

    expect(prismaMock.shlink_access.create).toHaveBeenCalledWith({
      data: entity,
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and create many entities', async () => {
    const entities: SHLinkAccessEntity[] = [
      entity,
      {
        id: '2',
        recipient: 'Jane Doe',
        shlink_id: '1',
        access_time: new Date(),
      },
    ];
    prismaMock.shlink_access.createMany.mockResolvedValue(entities);

    const result = await repository.insertMany(entities);

    expect(prismaMock.shlink_access.createMany).toHaveBeenCalledWith({
      data: entities,
    });
    expect(result).toEqual(entities);
  });

  test('should call getModel and find an entity by id', async () => {
    prismaMock.shlink_access.findFirst.mockResolvedValue(entity);

    const result = await repository.findById('1');

    expect(prismaMock.shlink_access.findFirst).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and find one entity with filter', async () => {
    const filter = { id: '1' };
    prismaMock.shlink_access.findFirst.mockResolvedValue(entity);

    const result = await repository.findOne(filter);

    expect(prismaMock.shlink_access.findFirst).toHaveBeenCalledWith({
      where: filter,
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and find many entities with filters', async () => {
    const filters = { id: '1' };
    const entities: SHLinkAccessEntity[] = [entity];
    prismaMock.shlink_access.findMany.mockResolvedValue(entities);

    const result = await repository.findMany(filters);

    expect(prismaMock.shlink_access.findMany).toHaveBeenCalledWith({
      where: filters,
    });
    expect(result).toEqual(entities);
  });

  test('should call getModel and update an entity', async () => {
    prismaMock.shlink_access.update.mockResolvedValue(entity);

    const result = await repository.update(entity);

    expect(prismaMock.shlink_access.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: entity,
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and delete an entity', async () => {
    prismaMock.shlink_access.delete.mockResolvedValue(entity);

    const result = await repository.delete(entity);

    expect(prismaMock.shlink_access.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toBe(entity);
  });
});
