/**
 * @jest-environment node
 */
import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkEntity } from '@/entities/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';

import { getSHLinkUseCase } from './get-shlink';

const dateValue = new Date('2024-01-01T00:00:00Z')

// Mock the repository interface
describe('getSHLinkUseCase', () => {
  let mockRepo: Partial<jest.Mocked<ISHLinkRepository>>;
  let mockContext: { repo: ISHLinkRepository };
  let mockSHLinkEntities: SHLinkEntity[];
  let mockUserId: string;
  let mockModels: SHLinkModel[];

  beforeEach(() => {
    mockRepo = {
      findMany: jest.fn(),
    };

    mockContext = { repo: mockRepo as ISHLinkRepository };

    mockUserId = '1234567890';

    // Mock entity data
    mockSHLinkEntities = [
      {
        id: '1',
        name: 'name 1',
        user_id: mockUserId,
        passcode_failures_remaining: 3,
        active: true,
        management_token: 'token-xyz1234',
        config_passcode: 'passcode-abcde',
        config_exp: dateValue,
        created_at: dateValue,
        updated_at: dateValue
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
        created_at: dateValue,
        updated_at: dateValue
      },
    ];

    mockModels = [
      new SHLinkModel(
        mockUserId,
        'name 1',
        3,
        true,
        'token-xyz1234',
        'passcode-abcde',
        dateValue,
        '1',
        dateValue,
        dateValue
      ),
      new SHLinkModel(
        mockUserId,
        'name 2',
        1,
        false,
        'token-uvw5678',
        'passcode-fghij',
        new Date('2024-06-01T00:00:00Z'),
        '2',
        dateValue,
        dateValue
      ),
    ];

    (mockRepo.findMany as jest.Mock).mockResolvedValue(mockSHLinkEntities);
  });

  it("should call the repository's findMany method with the correct user_id", async () => {
    await getSHLinkUseCase(mockContext, { user_id: mockUserId });

    expect(mockRepo.findMany).toHaveBeenCalledWith({ user_id: mockUserId });
  });

  it('should return the list of SHLinkEntities returned by the repository', async () => {
    const result = await getSHLinkUseCase(mockContext, { user_id: mockUserId });

    expect(result.length).toEqual(mockModels.length);
  });

  it('should return an empty array if the repository returns no entities', async () => {
    (mockRepo.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getSHLinkUseCase(mockContext, { user_id: mockUserId });

    expect(result).toEqual([]);
  });

  it('should filter by active status when status is "active"', async () => {
    await getSHLinkUseCase(mockContext, { user_id: mockUserId, status: 'active' });

    expect(mockRepo.findMany).toHaveBeenCalledWith({
      user_id: mockUserId,
      active: true,
    });
  });

  it('should filter by inactive status when status is "inactive"', async () => {
    await getSHLinkUseCase(mockContext, { user_id: mockUserId, status: 'inactive' });

    expect(mockRepo.findMany).toHaveBeenCalledWith({
      user_id: mockUserId,
      active: false,
    });
  });

  it('should filter by expired status when status is "expired"', async () => {
    const dateBeforeNow = new Date();
    jest.useFakeTimers().setSystemTime(dateBeforeNow); // Mock the current date

    await getSHLinkUseCase(mockContext, { user_id: mockUserId, status: 'expired' });

    expect(mockRepo.findMany).toHaveBeenCalledWith({
      user_id: mockUserId,
      config_exp: {
        lt: dateBeforeNow,
      },
    });

    jest.useRealTimers();
  });
});
