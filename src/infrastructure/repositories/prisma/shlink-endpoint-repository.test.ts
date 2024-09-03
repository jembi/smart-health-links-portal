import { PrismaClient } from '@prisma/client';
import { SHLinkEndpointEntity } from '@/entities/shlink-endpoint';
import { SHLinkEndpointPrismaRepository } from './shlink-endpoint-repository';

// Create a mock for PrismaClient
const prismaMock = {
  shlink_endpoint: {
    create: jest.fn(),
    createMany: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const entity: SHLinkEndpointEntity = {
  id: '1',
  url_path: 'unique',
  server_config_id: '1',
  shlink_id: '1',
};

describe('SHLinkEndpointPrismaRepository', () => {
  let repository: SHLinkEndpointPrismaRepository;

  beforeEach(() => {
    // Instantiate the repository before each test
    repository = new SHLinkEndpointPrismaRepository(
      prismaMock as unknown as PrismaClient,
    );
  });

  test('should call getModel and create a new entity', async () => {
    prismaMock.shlink_endpoint.create.mockResolvedValue(entity);

    const result = await repository.insert(entity);

    expect(prismaMock.shlink_endpoint.create).toHaveBeenCalledWith({
      data: entity,
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and create many entities', async () => {
    const entities: SHLinkEndpointEntity[] = [
      entity,
      { id: '2', url_path: 'Jane Doe', shlink_id: '1', server_config_id: '1' },
    ];
    prismaMock.shlink_endpoint.createMany.mockResolvedValue(entities);

    const result = await repository.insertMany(entities);

    expect(prismaMock.shlink_endpoint.createMany).toHaveBeenCalledWith({
      data: entities,
    });
    expect(result).toEqual(entities);
  });

  test('should call getModel and find an entity by id', async () => {
    prismaMock.shlink_endpoint.findFirst.mockResolvedValue(entity);

    const result = await repository.findById('1');

    expect(prismaMock.shlink_endpoint.findFirst).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and find one entity with filter', async () => {
    const filter = { id: '1' };
    prismaMock.shlink_endpoint.findFirst.mockResolvedValue(entity);

    const result = await repository.findOne(filter);

    expect(prismaMock.shlink_endpoint.findFirst).toHaveBeenCalledWith({
      where: filter,
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and find many entities with filters', async () => {
    const filters = { id: '1' };
    const entities: SHLinkEndpointEntity[] = [entity];
    prismaMock.shlink_endpoint.findMany.mockResolvedValue(entities);

    const result = await repository.findMany(filters);

    expect(prismaMock.shlink_endpoint.findMany).toHaveBeenCalledWith({
      where: filters,
    });
    expect(result).toEqual(entities);
  });

  test('should call getModel and update an entity', async () => {
    prismaMock.shlink_endpoint.update.mockResolvedValue(entity);

    const result = await repository.update(entity);

    expect(prismaMock.shlink_endpoint.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: entity,
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and delete an entity', async () => {
    prismaMock.shlink_endpoint.delete.mockResolvedValue(entity);

    const result = await repository.delete(entity);

    expect(prismaMock.shlink_endpoint.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toBe(entity);
  });
});
