import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkEntity } from '@/entities/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapEntityToModel } from '@/mappers/shlink-mapper';

import { updateSingleSHLinkUseCase } from './update-single-shlink';

// Mock the repository and mapper
jest.mock('@/mappers/shlink-mapper', () => ({
  mapEntityToModel: jest.fn(),
}));

const dateValue = new Date('2024-01-01T00:00:00Z')

describe('updateSingleSHLinkUseCase', () => {
  let mockRepo: jest.Mocked<ISHLinkRepository>;
  let mockSHLinkModel: SHLinkModel;
  let mockSHLinkEntity: SHLinkEntity;

  beforeEach(() => {
    // Setup mock data
    const mockDto = {
      userId: '1234567890',
      name: 'shlink',
      passcodeFailuresRemaining: 3,
      active: true,
      managementToken: 'token-xyz1234',
      configPasscode: 'passcode-abcde',
      configExp: dateValue,
      created_at: dateValue,
      updated_at: dateValue
    };

    mockSHLinkModel = new SHLinkModel(
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

    mockSHLinkEntity = {
      id: '1',
      name: mockDto.name,
      user_id: mockDto.userId,
      passcode_failures_remaining: mockDto.passcodeFailuresRemaining,
      active: mockDto.active,
      management_token: mockDto.managementToken,
      config_passcode: mockDto.configPasscode,
      config_exp: mockDto.configExp,
      created_at: dateValue,
      updated_at: dateValue
    };

    mockRepo = {
      findOne: jest.fn(),
      update: jest.fn(), // Updated method
    } as unknown as jest.Mocked<ISHLinkRepository>;
  });

  it('should update SHLink entity and return the updated model', async () => {
    const updatedSHLinkEntity: SHLinkEntity = {
      ...mockSHLinkEntity,
      config_passcode: 'new-passcode',
      config_exp: dateValue,
    };

    // Mock repository behavior
    mockRepo.findOne.mockResolvedValue(mockSHLinkEntity);
    mockRepo.update.mockResolvedValue(updatedSHLinkEntity);
    (mapEntityToModel as jest.Mock).mockReturnValue(mockSHLinkModel);

    // Call the use case
    const result = await updateSingleSHLinkUseCase(
      { repo: mockRepo, validator: jest.fn().mockResolvedValue(true) }, // Mock validator
      {
        id: '1',
        passcode: 'new-passcode',
        expiryDate: dateValue,
      },
    );

    // Verify repository interactions
    expect(mockRepo.findOne).toHaveBeenCalledWith({ id: '1' });
    expect(mockRepo.update).toHaveBeenCalledWith({
      ...mockSHLinkEntity,
      config_passcode: 'new-passcode',
      config_exp: dateValue,
    });

    // Verify mapper and result
    expect(mapEntityToModel).toHaveBeenCalledWith(updatedSHLinkEntity);
    expect(result).toEqual(mockSHLinkModel);
  });

  it('should not update config_passcode or config_exp if they are not set in the data', async () => {
    const mockSHLinkModelWithoutFields = new SHLinkModel(
      mockSHLinkModel.getUserId(),
      mockSHLinkModel.getName(),
      mockSHLinkModel.getPasscodeFailuresRemaining(),
      mockSHLinkModel.getActive(),
      mockSHLinkModel.getManagementToken(),
      undefined, // No configPasscode
      undefined, // No configExp
      '1',
    );

    const entityWithoutConfig: SHLinkEntity = {
      ...mockSHLinkEntity,
      config_passcode: mockSHLinkEntity.config_passcode, // Should remain unchanged
      config_exp: mockSHLinkEntity.config_exp, // Should remain unchanged
    };

    // Mock repository behavior
    mockRepo.findOne.mockResolvedValue(mockSHLinkEntity);
    mockRepo.update.mockResolvedValue(entityWithoutConfig);
    (mapEntityToModel as jest.Mock).mockReturnValue(
      mockSHLinkModelWithoutFields,
    );

    // Call the use case
    const result = await updateSingleSHLinkUseCase(
      { repo: mockRepo, validator: jest.fn().mockResolvedValue(true) }, // Mock validator
      { id: '1' }, // No passcode or expiryDate provided
    );

    // Verify repository interactions
    expect(mockRepo.findOne).toHaveBeenCalledWith({ id: '1' });
    expect(mockRepo.update).toHaveBeenCalledWith(entityWithoutConfig);

    // Verify result
    expect(result).toEqual(mockSHLinkModelWithoutFields);
  });

  it('should call validator before updating', async () => {
    const mockValidator = jest.fn().mockResolvedValue(true);

    // Mock repository behavior
    mockRepo.findOne.mockResolvedValue(mockSHLinkEntity);
    mockRepo.update.mockResolvedValue(mockSHLinkEntity);
    (mapEntityToModel as jest.Mock).mockReturnValue(mockSHLinkModel);

    // Call the use case
    await updateSingleSHLinkUseCase(
      { repo: mockRepo, validator: mockValidator },
      { id: '1', passcode: 'new-passcode' },
    );

    // Verify validator call
    expect(mockValidator).toHaveBeenCalledWith({
      shlink: mockSHLinkModel,
      passcode: 'new-passcode',
    });
  });
});
