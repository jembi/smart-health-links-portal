import { SHLinkEntity } from "@/entities/shlink";
import { PrismaClient } from "@prisma/client";
import { SHLinkPrismaRepository } from "./shlink-repository";

// Create a mock for PrismaClient
const prismaMock = {
  shlink: {
    create: jest.fn(),
    createMany: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const entity: SHLinkEntity = { id: '1', config_passcode: 'unique', management_token: '1', user_id: '1', active: false, config_exp: 2, passcode_failures_remaining: 0};

describe('SHLinkPrismaRepository', () => {
  let repository: SHLinkPrismaRepository;

  beforeEach(() => {
    // Instantiate the repository before each test
    repository = new SHLinkPrismaRepository(prismaMock as unknown as PrismaClient);
  });

  test('should call getModel and create a new entity', async () => {
    prismaMock.shlink.create.mockResolvedValue(entity);

    const result = await repository.insert(entity);

    expect(prismaMock.shlink.create).toHaveBeenCalledWith({ data: entity });
    expect(result).toBe(entity);
  });

  test('should call getModel and create many entities', async () => {
    const entities: SHLinkEntity[] = [entity, { id: '2', config_passcode: 'Jane Doe', management_token: '1', user_id: '1', active: false, config_exp: 0, passcode_failures_remaining: 0 }];
    prismaMock.shlink.createMany.mockResolvedValue(entities);

    const result = await repository.insertMany(entities);

    expect(prismaMock.shlink.createMany).toHaveBeenCalledWith({ data: entities });
    expect(result).toEqual(entities);
  });

  test('should call getModel and find an entity by id', async () => {
    prismaMock.shlink.findFirst.mockResolvedValue(entity);

    const result = await repository.findById('1');

    expect(prismaMock.shlink.findFirst).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toBe(entity);
  });

  test('should call getModel and find one entity with filter', async () => {
    const filter = { id: '1' };
    prismaMock.shlink.findFirst.mockResolvedValue(entity);

    const result = await repository.findOne(filter);

    expect(prismaMock.shlink.findFirst).toHaveBeenCalledWith({ where: filter });
    expect(result).toBe(entity);
  });

  test('should call getModel and find many entities with filters', async () => {
    const filters = { id: '1' };
    const entities: SHLinkEntity[] = [entity];
    prismaMock.shlink.findMany.mockResolvedValue(entities);

    const result = await repository.findMany(filters);

    expect(prismaMock.shlink.findMany).toHaveBeenCalledWith({ where: filters });
    expect(result).toEqual(entities);
  });

  test('should call getModel and update an entity', async () => {
    prismaMock.shlink.update.mockResolvedValue(entity);

    const result = await repository.update(entity);

    expect(prismaMock.shlink.update).toHaveBeenCalledWith({ where: { id: '1' }, data: entity });
    expect(result).toBe(entity);
  });

  test('should call getModel and delete an entity', async () => {
    prismaMock.shlink.delete.mockResolvedValue(entity);

    const result = await repository.delete(entity);

    expect(prismaMock.shlink.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toBe(entity);
  });
});
