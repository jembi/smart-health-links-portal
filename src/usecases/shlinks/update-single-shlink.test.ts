import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkEntity } from '@/entities/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapEntityToModel, mapModelToEntity } from '@/mappers/shlink-mapper';

import { updateSingleSHLinkUseCase } from './update-single-shlink';

// Mock the mappers
jest.mock('@/mappers/shlink-mapper');

describe('updateSingleSHLinkUseCase', () => {
  let repo: jest.Mocked<ISHLinkRepository>;
  let mockValidator: jest.Mock;
  let mockEntity: SHLinkEntity;
  let mockModel: SHLinkModel;

  beforeEach(() => {
    // Mock repository
    repo = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<ISHLinkRepository>;

    // Mock validator
    mockValidator = jest.fn();

    // Mock SHLinkEntity and SHLinkModel
    mockEntity = { id: '1', active: false } as SHLinkEntity;
    mockModel = {
      id: '1',
      active: false,
      setConfigPasscode: jest.fn(),
      setConfigExp: jest.fn(),
      getConfigPasscode: jest.fn().mockReturnValue('1234'),
    } as unknown as SHLinkModel;

    // Mock the mapper functions
    (mapEntityToModel as jest.Mock).mockReturnValue(mockModel);
    (mapModelToEntity as jest.Mock).mockReturnValue(mockEntity);
  });

  it('should update the passcode and expiry date and return the updated model', async () => {
    // Arrange
    const data = { id: '1', passcode: 'newPasscode', expiryDate: new Date('2024-12-31') };
    repo.findOne.mockResolvedValue(mockEntity);
    repo.update.mockResolvedValue(mockEntity);

    // Act
    const result = await updateSingleSHLinkUseCase(
      { repo, validator: mockValidator },
      data
    );

    // Assert
    expect(repo.findOne).toHaveBeenCalledWith({ id: data.id });
    expect(mockModel.setConfigPasscode).toHaveBeenCalledWith(data.passcode);
    expect(mockModel.setConfigExp).toHaveBeenCalledWith(data.expiryDate);
    expect(mockValidator).toHaveBeenCalledWith({
      shlink: mockModel,
      passcode: '1234',
    });
    expect(repo.update).toHaveBeenCalledWith(mockEntity);
    expect(result).toBe(mockModel);
  });

  it('should not set passcode or expiry date if they are not provided', async () => {
    // Arrange
    const data = { id: '1' }; // No passcode or expiry date
    repo.findOne.mockResolvedValue(mockEntity);
    repo.update.mockResolvedValue(mockEntity);

    // Act
    const result = await updateSingleSHLinkUseCase(
      { repo, validator: mockValidator },
      data
    );

    // Assert
    expect(repo.findOne).toHaveBeenCalledWith({ id: data.id });
    expect(mockModel.setConfigPasscode).not.toHaveBeenCalled();
    expect(mockModel.setConfigExp).not.toHaveBeenCalled();
    expect(mockValidator).toHaveBeenCalledWith({
      shlink: mockModel,
      passcode: '1234',
    });
    expect(repo.update).toHaveBeenCalledWith(mockEntity);
    expect(result).toBe(mockModel);
  });

  it('should throw an error if the validator fails', async () => {
    // Arrange
    const data = { id: '1', passcode: 'invalidPasscode' };
    repo.findOne.mockResolvedValue(mockEntity);
    mockValidator.mockImplementation(() => {
      throw new Error('Validation failed');
    });

    // Act & Assert
    await expect(
      updateSingleSHLinkUseCase(
        { repo, validator: mockValidator },
        data
      )
    ).rejects.toThrow('Validation failed');
  });
});
