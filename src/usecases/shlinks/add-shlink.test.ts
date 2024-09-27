import { CreateSHLinkDto } from '@/domain/dtos/shlink';
import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkEntity } from '@/entities/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapEntityToModel, mapModelToEntity } from '@/mappers/shlink-mapper';

import { addShlinkUseCase } from './add-shlink';

// Mock the dependencies
jest.mock('@/mappers/shlink-mapper', () => ({
  mapEntityToModel: jest.fn(),
  mapModelToEntity: jest.fn(),
}));

const dateValue = new Date('2024-01-01T00:00:00Z')

describe('addShlinkUseCase', () => {
  let mockRepo: Partial<jest.Mocked<ISHLinkRepository>>;
  let mockContext: { repo: ISHLinkRepository };
  let mockShlinkModel: SHLinkModel;
  let mockShlinkEntity: SHLinkEntity;
  let mockInsertedShlinkEntity: SHLinkEntity;
  let mockReturnedShlinkModel: SHLinkModel;

  beforeEach(() => {
    mockRepo = {
      insert: jest.fn(),
    };

    mockContext = { repo: mockRepo as ISHLinkRepository };

    // Constants
    const mockDto = {
      userId: '1234567890',
      name: 'name',
      passcodeFailuresRemaining: 3,
      active: true,
      managementToken: 'token-xyz1234',
      configPasscode: 'passcode-abcde',
      configExp: dateValue,
    };

    const mockModel = new SHLinkModel(
      mockDto.userId,
      mockDto.name,
      mockDto.passcodeFailuresRemaining,
      mockDto.active,
      mockDto.managementToken,
      mockDto.configPasscode,
      mockDto.configExp,
      '1',
      dateValue,
      dateValue
    );

    const mockEntity: SHLinkEntity = {
      id: '1',
      name: 'name',
      user_id: mockDto.userId,
      passcode_failures_remaining: mockDto.passcodeFailuresRemaining,
      active: mockDto.active,
      management_token: mockDto.managementToken,
      config_passcode: mockDto.configPasscode,
      config_exp: mockDto.configExp,
      created_at: dateValue,
      updated_at: dateValue
    };

    // Mock the data
    mockShlinkModel = mockModel;
    mockShlinkEntity = mockEntity;
    mockInsertedShlinkEntity = mockEntity;
    mockReturnedShlinkModel = mockModel;

    // Set up mock implementations
    (mapModelToEntity as jest.Mock).mockReturnValue(mockShlinkEntity);
    (mapEntityToModel as jest.Mock).mockReturnValue(mockReturnedShlinkModel);

    // Set up repo insert method to return the inserted entity
    (mockRepo.insert as jest.Mock).mockResolvedValue(mockInsertedShlinkEntity);
  });

  it('should map the SHLinkModel to SHLinkEntity and set id to undefined and active to true', async () => {
    await addShlinkUseCase(mockContext, { shlink: mockShlinkModel });

    expect(mapModelToEntity).toHaveBeenCalledWith(mockShlinkModel);
    expect(mockShlinkEntity.id).toBeUndefined();
    expect(mockShlinkEntity.active).toBe(true);
  });

  it("should call the repository's insert method with the correct entity", async () => {
    await addShlinkUseCase(mockContext, { shlink: mockShlinkModel });

    expect(mockRepo.insert).toHaveBeenCalledWith(mockShlinkEntity);
  });

  it('should map the inserted SHLinkEntity back to SHLinkModel', async () => {
    const result = await addShlinkUseCase(mockContext, {
      shlink: mockShlinkModel,
    });

    expect(mapEntityToModel).toHaveBeenCalledWith(mockInsertedShlinkEntity);
    expect(result).toBe(mockReturnedShlinkModel);
  });
});
