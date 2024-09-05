import { updateSingleSHLinkUseCase } from './update-single-shlink';
import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkEntity } from '@/entities/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapEntityToModel } from '@/mappers/shlink-mapper';

// Mock the repository and mapper
jest.mock('@/mappers/shlink-mapper', () => ({
  mapEntityToModel: jest.fn(),
}));

describe('updateSingleSHLinkUseCase', () => {
  let mockRepo: jest.Mocked<ISHLinkRepository>;
  let mockDto: any;
  let mockSHLinkModel: SHLinkModel;
  let mockSHLinkEntity: SHLinkEntity;

  beforeEach(() => {
    // Setup mock data
    mockDto = {
      userId: "1234567890",
      passcodeFailuresRemaining: 3,
      active: true,
      managementToken: "token-xyz1234",
      configPasscode: "passcode-abcde",
      configExp: new Date("2024-01-01T00:00:00Z"),
    };

    mockSHLinkModel = new SHLinkModel(
      mockDto.userId,
      mockDto.passcodeFailuresRemaining,
      mockDto.active,
      mockDto.managementToken,
      mockDto.configPasscode,
      mockDto.configExp,
      "1"
    );

    mockSHLinkEntity = {
      id: "1",
      user_id: mockDto.userId,
      passcode_failures_remaining: mockDto.passcodeFailuresRemaining,
      active: mockDto.active,
      management_token: mockDto.managementToken,
      config_passcode: mockDto.configPasscode,
      config_exp: mockDto.configExp,
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
      config_exp: new Date("2024-01-01T00:00:00Z"),
    };

    // Spy on getConfigPasscode to return new passcode
    jest.spyOn(mockSHLinkModel, 'getConfigPasscode').mockReturnValue('new-passcode');

    // Mock repository behavior
    mockRepo.findOne.mockResolvedValue(mockSHLinkEntity);
    mockRepo.update.mockResolvedValue(updatedSHLinkEntity);
    (mapEntityToModel as jest.Mock).mockReturnValue(mockSHLinkModel);

    // Call the use case
    const result = await updateSingleSHLinkUseCase(
      { repo: mockRepo },
      { id: '1', shlink: mockSHLinkModel }
    );

    // Verify repository interactions
    expect(mockRepo.findOne).toHaveBeenCalledWith({ id: '1' });
    expect(mockRepo.update).toHaveBeenCalledWith({
      ...mockSHLinkEntity,
      config_passcode: 'new-passcode',
      config_exp: new Date("2024-01-01T00:00:00Z"),
    });

    // Verify mapper and result
    expect(mapEntityToModel).toHaveBeenCalledWith(updatedSHLinkEntity);
    expect(result).toEqual(mockSHLinkModel);
  });

  it('should not update config_passcode or config_exp if they are not set in the SHLinkModel', async () => {
    const mockSHLinkModelWithoutFields = new SHLinkModel(
      mockDto.userId,
      mockDto.passcodeFailuresRemaining,
      mockDto.active,
      mockDto.managementToken,
      undefined, // No configPasscode
      undefined, // No configExp
      "1"
    );

    const entityWithoutConfig: SHLinkEntity = {
      ...mockSHLinkEntity,
      config_passcode: undefined,
      config_exp: undefined,
    };

    // Mock repository behavior
    mockRepo.findOne.mockResolvedValue(entityWithoutConfig);
    mockRepo.update.mockResolvedValue(entityWithoutConfig);
    (mapEntityToModel as jest.Mock).mockReturnValue(mockSHLinkModelWithoutFields);

    // Call the use case
    const result = await updateSingleSHLinkUseCase(
      { repo: mockRepo },
      { id: '1', shlink: mockSHLinkModelWithoutFields }
    );

    // Verify repository interactions
    expect(mockRepo.findOne).toHaveBeenCalledWith({ id: '1' });
    expect(mockRepo.update).toHaveBeenCalledWith(entityWithoutConfig);

    // Verify result
    expect(result).toEqual(mockSHLinkModelWithoutFields);
  });

  
});
