import { SHLinkEntity } from '@/entities/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';

import { getSHLinkUseCase } from './get-shlink';

// Mock the repository interface
describe('getSHLinkUseCase', () => {
  let mockRepo: Partial<jest.Mocked<ISHLinkRepository>>;
  let mockContext: { repo: ISHLinkRepository };
  let mockSHLinkEntity: SHLinkEntity[];
  let mockUserId: string;

  beforeEach(() => {
    mockRepo = {
      findMany: jest.fn(),
    };

    mockContext = { repo: mockRepo as ISHLinkRepository };

    mockUserId = '1234567890';

    // Mock entity data
    mockSHLinkEntity = [
      {
        id: '1',
        name: 'name 1',
        user_id: mockUserId,
        passcode_failures_remaining: 3,
        active: true,
        management_token: 'token-xyz1234',
        config_passcode: 'passcode-abcde',
        config_exp: new Date('2024-01-01T00:00:00Z'),
      },
      {
        id: '2',
        name: 'name 2',
        user_id: mockUserId,
        passcode_failures_remaining: 1,
        active: false,
        management_token: 'token-uvw5678',
        config_passcode: 'passcode-fghij',
        config_exp: new Date('2024-06-01T00:00:00Z'),
      },
    ];

    // Set up mock implementations
    (mockRepo.findMany as jest.Mock).mockResolvedValue(mockSHLinkEntity);
  });

  it("should call the repository's findMany method with the correct user_id", async () => {
    await getSHLinkUseCase(mockContext, { user_id: mockUserId });

    expect(mockRepo.findMany).toHaveBeenCalledWith({ user_id: mockUserId });
  });

  it('should return the list of SHLinkEntities returned by the repository', async () => {
    const result = await getSHLinkUseCase(mockContext, { user_id: mockUserId });

    expect(result).toEqual(mockSHLinkEntity);
  });

  it('should return an empty array if the repository returns no entities', async () => {
    (mockRepo.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getSHLinkUseCase(mockContext, { user_id: mockUserId });

    expect(result).toEqual([]);
  });
});
