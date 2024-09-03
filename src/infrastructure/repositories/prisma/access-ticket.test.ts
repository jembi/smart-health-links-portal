import { AccessTicketEntity } from '@/entities/access-ticket';
import { PrismaClient } from '@prisma/client';
import { AccessTicketPrismaRepository } from './access-ticket-repository';

// Create a mock for PrismaClient
const prismaMock = {
  access_ticket: {
    create: jest.fn(),
    createMany: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const entity: AccessTicketEntity = {
  id: '1',
  shlink_id: '1'
};

describe('AccessTicketPrismaRepository', () => {
  let repository: AccessTicketPrismaRepository;

  beforeEach(() => {
    // Instantiate the repository before each test
    repository = new AccessTicketPrismaRepository(
      prismaMock as unknown as PrismaClient,
    );
  });

  test('should call getModel and create a new entity', async () => {
    prismaMock.access_ticket.create.mockResolvedValue(entity);

    const result = await repository.insert(entity);

    expect(prismaMock.access_ticket.create).toHaveBeenCalledWith({ data: entity });
    expect(result).toBe(entity);
  });

  test('should call getModel and create many entities', async () => {
    const entities = [
      entity,
      { id: '2', shlink_id: '2' },
    ] as AccessTicketEntity[];
    prismaMock.access_ticket.createMany.mockResolvedValue(entities);

    const result = await repository.insertMany(entities);

    expect(prismaMock.access_ticket.createMany).toHaveBeenCalledWith({
      data: entities,
    });
    expect(result).toEqual(entities);
  });

  test('should call getModel and find an entity by id', async () => {
    prismaMock.access_ticket.findFirst.mockResolvedValue(entity);

    const result = await repository.findById('1');

    expect(prismaMock.access_ticket.findFirst).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and find one entity with filter', async () => {
    const filter = { id: '1' };
    prismaMock.access_ticket.findFirst.mockResolvedValue(entity);

    const result = await repository.findOne(filter);

    expect(prismaMock.access_ticket.findFirst).toHaveBeenCalledWith({
      where: filter,
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and find many entities with filters', async () => {
    const filters = { id: '1' };
    const entities = [entity] as AccessTicketEntity[];
    prismaMock.access_ticket.findMany.mockResolvedValue(entities);

    const result = await repository.findMany(filters);

    expect(prismaMock.access_ticket.findMany).toHaveBeenCalledWith({
      where: filters,
    });
    expect(result).toEqual(entities);
  });

  test('should call getModel and update an entity', async () => {
    prismaMock.access_ticket.update.mockResolvedValue(entity);

    const result = await repository.update(entity);

    expect(prismaMock.access_ticket.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: entity,
    });
    expect(result).toBe(entity);
  });

  test('should call getModel and delete an entity', async () => {
    prismaMock.access_ticket.delete.mockResolvedValue(entity);

    const result = await repository.delete(entity);

    expect(prismaMock.access_ticket.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toBe(entity);
  });
});
