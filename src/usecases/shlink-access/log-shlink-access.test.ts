import { SHLinkAccessModel } from '@/domain/models/shlink-access';
import { ISHLinkAccessRepository } from '@/infrastructure/repositories/interfaces/shlink-access-repository';
import { mapModelToEntity } from '@/mappers/shlink-access-mapper';

import { logSHLinkAccessUseCase } from './log-shlink-access';

// Mock the mapping function and repository
jest.mock('@/mappers/shlink-access-mapper', () => ({
  mapModelToEntity: jest.fn(),
}));

jest.mock(
  '@/infrastructure/repositories/interfaces/shlink-access-repository',
  () => ({
    ISHLinkAccessRepository: jest.fn(),
  }),
);

describe('logSHLinkAccess', () => {
  const mockInsert = jest.fn();
  const mockRepo = { insert: mockInsert } as unknown as ISHLinkAccessRepository;
  const mockMapModelToEntity = mapModelToEntity as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call repo.insert with the correct entity', async () => {
    const accessModel = new SHLinkAccessModel(
      'shlink-id',
      new Date(),
      'recipient@example.com',
    );
    const accessEntity = {
      /* entity properties */
    };

    mockMapModelToEntity.mockReturnValue(accessEntity);

    await logSHLinkAccessUseCase({ repo: mockRepo }, accessModel);

    // Assert that mapModelToEntity was called with the correct model
    expect(mockMapModelToEntity).toHaveBeenCalledWith(accessModel);

    // Assert that repo.insert was called with the mapped entity
    expect(mockInsert).toHaveBeenCalledWith(accessEntity);
  });

  it('should handle cases where mapModelToEntity returns undefined', async () => {
    const accessModel = new SHLinkAccessModel(
      'shlink-id',
      new Date(),
      'recipient@example.com',
    );
    mockMapModelToEntity.mockReturnValue(undefined);

    await logSHLinkAccessUseCase({ repo: mockRepo }, accessModel);

    // Assert that mapModelToEntity was called with the correct model
    expect(mockMapModelToEntity).toHaveBeenCalledWith(accessModel);

    // Assert that repo.insert was called with undefined
    expect(mockInsert).toHaveBeenCalledWith(undefined);
  });
});
