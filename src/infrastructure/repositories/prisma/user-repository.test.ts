import { PrismaClient } from "@prisma/client";
import { BaseEntity } from "@/entities/base-entity";
import { UserEntity } from "@/entities/user";
import { UserPrismaRepository } from "./user-repository";

// Create a mock for PrismaClient
const prismaMock = {
  user: {
    create: jest.fn(),
    createMany: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const entity = { id: '1', user_id: 'John', patient_id: 'Doe' };

describe('UserPrismaRepository', () => {
  let repository: UserPrismaRepository;

  beforeEach(() => {
    // Instantiate the repository before each test
    repository = new UserPrismaRepository(prismaMock as unknown as PrismaClient);
  });

  test('should call getModel and create a new entity', async () => {
    prismaMock.user.create.mockResolvedValue(entity);

    const result = await repository.insert(entity);

    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: entity });
    expect(result).toBe(entity);
  });

  test('should call getModel and create many entities', async () => {
    const entities = [entity, { id: '2', user_id: 'Jane Doe', patient_id: 'John Doe' }] as UserEntity[];
    prismaMock.user.createMany.mockResolvedValue(entities);

    const result = await repository.insertMany(entities);

    expect(prismaMock.user.createMany).toHaveBeenCalledWith({ data: entities });
    expect(result).toEqual(entities);
  });

  test('should call getModel and find an entity by id', async () => {
    prismaMock.user.findFirst.mockResolvedValue(entity);

    const result = await repository.findById('1');

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toBe(entity);
  });

  test('should call getModel and find one entity with filter', async () => {
    const filter = { id: '1' };
    prismaMock.user.findFirst.mockResolvedValue(entity);

    const result = await repository.findOne(filter);

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: filter });
    expect(result).toBe(entity);
  });

  test('should call getModel and find many entities with filters', async () => {
    const filters = { id: '1' };
    const entities = [entity] as BaseEntity[];
    prismaMock.user.findMany.mockResolvedValue(entities);

    const result = await repository.findMany(filters);

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({ where: filters });
    expect(result).toEqual(entities);
  });

  test('should call getModel and update an entity', async () => {
    prismaMock.user.update.mockResolvedValue(entity);

    const result = await repository.update(entity);

    expect(prismaMock.user.update).toHaveBeenCalledWith({ where: { id: '1' }, data: entity });
    expect(result).toBe(entity);
  });

  test('should call getModel and delete an entity', async () => {
    prismaMock.user.delete.mockResolvedValue(entity);

    const result = await repository.delete(entity);

    expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toBe(entity);
  });
});
