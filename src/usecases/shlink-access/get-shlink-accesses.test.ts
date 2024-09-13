import { SHLinkAccessModel } from '@/domain/models/shlink-access';
import { SHLinkAccessEntity } from '@/entities/shlink-access';
import { ISHLinkAccessRepository } from '@/infrastructure/repositories/interfaces/shlink-access-repository';
import { mapEntityToModel } from '@/mappers/shlink-access-mapper';

import { getSHLinkAccessesUseCase } from './get-shlink-accesses';

// Mock the mapping function and repository
jest.mock('@/mappers/shlink-access-mapper', () => ({
  mapEntityToModel: jest.fn(),
}));

jest.mock(
  '@/infrastructure/repositories/interfaces/shlink-access-repository',
  () => ({
    ISHLinkAccessRepository: jest.fn(),
  }),
);

describe('getSHLinkAccessesUseCase', () => {
  const mockFindMany = jest.fn();
  const mockRepo = {
    findMany: mockFindMany,
  } as unknown as ISHLinkAccessRepository;
  const mockEntityToModel = mapEntityToModel as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call repo.findMany with the correct filter', async () => {
    const accessModel = new SHLinkAccessModel(
      'shlink-id',
      new Date('2024-01-01T00:00:00Z'),
      'recipient@example.com',
      '1',
    );

    const accessEntity: SHLinkAccessEntity = {
      access_time: new Date('2024-01-01T00:00:00Z'),
      recipient: 'recipient@example.com',
      shlink_id: 'shlink-id',
      id: '1',
    };

    mockFindMany.mockReturnValue([accessEntity]);

    await getSHLinkAccessesUseCase(
      { repo: mockRepo },
      { shlinkId: 'shlink-id' },
    );

    // Assert that mapEntityToModel was called with the correct entity
    expect(mockEntityToModel).toHaveBeenCalledWith(accessEntity);

    // Assert that repo.findMany was called with the mapped correct filter.
    expect(mockFindMany).toHaveBeenCalledWith({ shlink_id: 'shlink-id' });
  });

  it('should handle cases where findMany returns an empty array', async () => {
    mockFindMany.mockReturnValue([]);

    await getSHLinkAccessesUseCase(
      { repo: mockRepo },
      { shlinkId: 'shlink-id' },
    );

    // Assert that mapModelToEntity was called with the correct model
    expect(mockEntityToModel).not.toHaveBeenCalled();

    // Assert that repo.insert was called with undefined
    expect(mockFindMany).toHaveBeenCalledWith({ shlink_id: 'shlink-id' });
  });
});
