import { PrismaClient } from "@prisma/client";
import { SHLinkFileEntity } from "@/entities/shlink-file";
import { SHLinkFilePrismaRepository } from "./shlink-file-repository";

// Create a mock for PrismaClient
const prismaMock = {
  shlink_file: {
    create: jest.fn(),
    createMany: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const entity: SHLinkFileEntity = { id: '1', content_hash: 'unique', content_type: '1', shlink_id: '1'};

describe('SHLinkFilePrismaRepository', () => {
  let repository: SHLinkFilePrismaRepository;

  beforeEach(() => {
    // Instantiate the repository before each test
    repository = new SHLinkFilePrismaRepository(prismaMock as unknown as PrismaClient);
  });

  test('should call getModel and create a new entity', async () => {
    prismaMock.shlink_file.create.mockResolvedValue(entity);

    const result = await repository.insert(entity);

    expect(prismaMock.shlink_file.create).toHaveBeenCalledWith({ data: entity });
    expect(result).toBe(entity);
  });

  test('should call getModel and create many entities', async () => {
    const entities: SHLinkFileEntity[] = [entity, { id: '2', content_hash: 'Jane Doe', shlink_id: '1', content_type: '1' }];
    prismaMock.shlink_file.createMany.mockResolvedValue(entities);

    const result = await repository.insertMany(entities);

    expect(prismaMock.shlink_file.createMany).toHaveBeenCalledWith({ data: entities });
    expect(result).toEqual(entities);
  });

  test('should call getModel and find an entity by id', async () => {
    prismaMock.shlink_file.findFirst.mockResolvedValue(entity);

    const result = await repository.findById('1');

    expect(prismaMock.shlink_file.findFirst).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toBe(entity);
  });

  test('should call getModel and find one entity with filter', async () => {
    const filter = { id: '1' };
    prismaMock.shlink_file.findFirst.mockResolvedValue(entity);

    const result = await repository.findOne(filter);

    expect(prismaMock.shlink_file.findFirst).toHaveBeenCalledWith({ where: filter });
    expect(result).toBe(entity);
  });

  test('should call getModel and find many entities with filters', async () => {
    const filters = { id: '1' };
    const entities: SHLinkFileEntity[] = [entity];
    prismaMock.shlink_file.findMany.mockResolvedValue(entities);

    const result = await repository.findMany(filters);

    expect(prismaMock.shlink_file.findMany).toHaveBeenCalledWith({ where: filters });
    expect(result).toEqual(entities);
  });

  test('should call getModel and update an entity', async () => {
    prismaMock.shlink_file.update.mockResolvedValue(entity);

    const result = await repository.update(entity);

    expect(prismaMock.shlink_file.update).toHaveBeenCalledWith({ where: { id: '1' }, data: entity });
    expect(result).toBe(entity);
  });

  test('should call getModel and delete an entity', async () => {
    prismaMock.shlink_file.delete.mockResolvedValue(entity);

    const result = await repository.delete(entity);

    expect(prismaMock.shlink_file.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toBe(entity);
  });
});
