import { PrismaClient } from '@prisma/client';
import { ServerConfigEntity } from '@/entities/server_config';
import { ServerConfigPrismaRepository } from './server-config-repository';

// Create a mock for PrismaClient
const prismaMock = {
  server_config: {
    create: jest.fn(),
    createMany: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const entity: ServerConfigEntity = {
  id: '1',
  config_client_id: 'unique',
  endpoint_url: 'hash',
  config_key: 'Doe',
  refresh_time: new Date(),
};

describe('ServerConfigPrismaRepository', () => {
  let repository: ServerConfigPrismaRepository;

  beforeEach(() => {
    // Instantiate the repository before each test
    repository = new ServerConfigPrismaRepository(
      prismaMock as unknown as PrismaClient,
    );
  });

  test('should call getModel and create a new entity', async () => {
    prismaMock.server_config.create.mockResolvedValue(entity);

    const result = await repository.insert(entity);

    expect(prismaMock.server_config.create).toHaveBeenCalledWith({
      data: entity,
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and create many entities', async () => {
    const entities = [
      entity,
      { id: '2', hash: 'Jane Doe', content: 'John Doe', ref_count: 0 },
    ] as ServerConfigEntity[];
    prismaMock.server_config.createMany.mockResolvedValue(entities);

    const result = await repository.insertMany(entities);

    expect(prismaMock.server_config.createMany).toHaveBeenCalledWith({
      data: entities,
    });
    expect(result).toEqual(entities);
  });

  test('should call getModel and find an entity by id', async () => {
    prismaMock.server_config.findFirst.mockResolvedValue(entity);

    const result = await repository.findById('1');

    expect(prismaMock.server_config.findFirst).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and find one entity with filter', async () => {
    const filter = { id: '1' };
    prismaMock.server_config.findFirst.mockResolvedValue(entity);

    const result = await repository.findOne(filter);

    expect(prismaMock.server_config.findFirst).toHaveBeenCalledWith({
      where: filter,
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and find many entities with filters', async () => {
    const filters = { id: '1' };
    const entities = [entity] as ServerConfigEntity[];
    prismaMock.server_config.findMany.mockResolvedValue(entities);

    const result = await repository.findMany(filters);

    expect(prismaMock.server_config.findMany).toHaveBeenCalledWith({
      where: filters,
    });
    expect(result).toEqual(entities);
  });

  test('should call getModel and update an entity', async () => {
    prismaMock.server_config.update.mockResolvedValue(entity);

    const result = await repository.update(entity);

    expect(prismaMock.server_config.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: entity,
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and delete an entity', async () => {
    prismaMock.server_config.delete.mockResolvedValue(entity);

    const result = await repository.delete(entity);

    expect(prismaMock.server_config.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toBe(entity);
  });
});
