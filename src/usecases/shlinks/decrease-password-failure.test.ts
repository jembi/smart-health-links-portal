/**
 * @jest-environment node
 */
import { SHLinkModel } from '@/domain/models/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapModelToEntity } from '@/mappers/shlink-mapper';

import { decreasePasswordFailureCountUseCase } from './decrease-password-failure';

// Mock dependencies
jest.mock('@/mappers/shlink-mapper', () => ({
  mapModelToEntity: jest.fn(),
}));

describe('decreasePasswordFailureCountUseCase', () => {
  const mockRepo: jest.Mocked<ISHLinkRepository> = {
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn(),
    insert: jest.fn(),
    insertMany: jest.fn(),
  };

  const mockMapModelToEntity = mapModelToEntity as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should decrease passcode failure count and update the repository', async () => {
    const initialFailures = 5;
    const updatedFailures = initialFailures - 1;
    const shlinkModel = new SHLinkModel(
      'unique-user-123',
      'name',
      initialFailures,
      true,
    );
    const entity = {
      passcode_failures_remaining: initialFailures,
    };

    // Mock the mapModelToEntity function
    mockMapModelToEntity.mockReturnValue(entity);

    // Call the use case function
    await decreasePasswordFailureCountUseCase({ repo: mockRepo }, shlinkModel);

    // Check if mapModelToEntity was called with the correct argument
    expect(mockMapModelToEntity).toHaveBeenCalledWith(shlinkModel);

    // Check if the passcode_failures_remaining was correctly decremented
    expect(entity.passcode_failures_remaining).toBe(updatedFailures);

    // Check if update was called with the updated entity
    expect(mockRepo.update).toHaveBeenCalledWith(entity);
  });

  it('should handle the case when passcode_failures_remaining is 0', async () => {
    const initialFailures = 0;
    const shlinkModel = new SHLinkModel(
      'unique-user-123',
      'name',
      initialFailures,
      true,
    );
    const entity = {
      passcode_failures_remaining: initialFailures,
    };

    // Mock the mapModelToEntity function
    mockMapModelToEntity.mockReturnValue(entity);

    // Call the use case function
    await decreasePasswordFailureCountUseCase({ repo: mockRepo }, shlinkModel);

    // Check if mapModelToEntity was called with the correct argument
    expect(mockMapModelToEntity).toHaveBeenCalledWith(shlinkModel);

    // Check if the passcode_failures_remaining was correctly decremented (remains 0)
    expect(entity.passcode_failures_remaining).toBe(-1);

    // Check if update was called with the updated entity
    expect(mockRepo.update).toHaveBeenCalledWith(entity);
  });
});
