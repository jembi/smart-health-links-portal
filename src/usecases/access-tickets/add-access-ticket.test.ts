import { AccessTicketModel } from '@/domain/models/access-ticket';
import { IAccessTicketRepository } from '@/infrastructure/repositories/interfaces/access-ticket-repository.interface';
import {
  mapEntityToModel,
  mapModelToEntity,
} from '@/mappers/access-ticket-mapper';

import { addAccessTicketUseCase } from './add-access-ticket';

// Mock the mapping functions
jest.mock('@/mappers/access-ticket-mapper', () => ({
  mapEntityToModel: jest.fn(),
  mapModelToEntity: jest.fn(),
}));

// Mock the IAccessTicketRepository
const mockRepo: jest.Mocked<IAccessTicketRepository> = {
  insert: jest.fn(),
  insertMany: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
  findMany: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};

describe('addAccessTicketUseCase', () => {
  const testModel = new AccessTicketModel('abc', '123');
  const testEntity = { id: '123', shlink_id: 'abc' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should map the model to an entity, call the repository insert method, and map the result back to a model', async () => {
    // Setup the mock implementations
    (mapModelToEntity as jest.Mock).mockReturnValue(testEntity);
    (mockRepo.insert as jest.Mock).mockResolvedValue(testEntity);
    (mapEntityToModel as jest.Mock).mockReturnValue(testModel);

    const result = await addAccessTicketUseCase({ repo: mockRepo }, testModel);

    // Assert that mapModelToEntity was called with the correct argument
    expect(mapModelToEntity).toHaveBeenCalledWith(testModel);

    // Assert that repo.insert was called with the correct entity
    expect(mockRepo.insert).toHaveBeenCalledWith(testEntity);

    // Assert that mapEntityToModel was called with the correct result
    expect(mapEntityToModel).toHaveBeenCalledWith(testEntity);

    // Assert that the result of the use case function is correct
    expect(result).toBe(testModel);
  });

  it('should handle cases where the repository returns undefined', async () => {
    // Setup the mock implementations
    (mapModelToEntity as jest.Mock).mockReturnValue(testEntity);
    (mockRepo.insert as jest.Mock).mockResolvedValue(undefined);
    (mapEntityToModel as jest.Mock).mockReturnValue(undefined);

    const result = await addAccessTicketUseCase({ repo: mockRepo }, testModel);

    // Assert that mapModelToEntity was called with the correct argument
    expect(mapModelToEntity).toHaveBeenCalledWith(testModel);

    // Assert that repo.insert was called with the correct entity
    expect(mockRepo.insert).toHaveBeenCalledWith(testEntity);

    // Assert that mapEntityToModel was called with undefined
    expect(mapEntityToModel).toHaveBeenCalledWith(undefined);

    // Assert that the result of the use case function is undefined
    expect(result).toBeUndefined();
  });
});
