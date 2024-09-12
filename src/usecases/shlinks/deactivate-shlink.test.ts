/**
 * @jest-environment node
 */

import { SHLinkModel } from "@/domain/models/shlink";
import { SHLinkEntity } from "@/entities/shlink";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { mapEntityToModel } from "@/mappers/shlink-mapper";

import { deactivateSHLinksUseCase } from "./deactivate-shlink";

// Mock the dependencies
jest.mock('@/mappers/shlink-mapper', () => ({
  mapEntityToModel: jest.fn(),
}));

describe('deactivateSHLinksUseCase', () => {
  let mockRepo: Partial<jest.Mocked<ISHLinkRepository>>;
  let mockContext: { repo: ISHLinkRepository };
  let mockSHLinkEntity: SHLinkEntity;
  let mockUpdatedSHLinkEntity: SHLinkEntity;
  let mockReturnedSHLinkModel: SHLinkModel;
  let mockId: string;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    mockContext = { repo: mockRepo as ISHLinkRepository };

    mockId = '1234567890';

    // Mock entity data
    mockSHLinkEntity = {
      id: mockId,
      name: 'name',
      user_id: 'user-123567',
      passcode_failures_remaining: 3,
      active: true,
      management_token: 'token-xyz1234',
      config_passcode: 'passcode-abcde',
      config_exp: new Date('2024-01-01T00:00:00Z'),
    };

    mockUpdatedSHLinkEntity = {
      ...mockSHLinkEntity,
      active: false, // Entity should be deactivated
    };

    mockReturnedSHLinkModel = new SHLinkModel(
      mockSHLinkEntity.user_id,
      mockSHLinkEntity.name,
      mockSHLinkEntity.passcode_failures_remaining,
      mockUpdatedSHLinkEntity.active,
      mockSHLinkEntity.management_token,
      mockSHLinkEntity.config_passcode,
      mockSHLinkEntity.config_exp,
      mockSHLinkEntity.id,
    );

    // Set up mock implementations
    (mockRepo.findById as jest.Mock).mockResolvedValue(mockSHLinkEntity);
    (mockRepo.update as jest.Mock).mockResolvedValue(mockUpdatedSHLinkEntity);
    (mapEntityToModel as jest.Mock).mockReturnValue(mockReturnedSHLinkModel);
  });

    it("should call the repository's findById method with the correct id", async () => {
        await deactivateSHLinksUseCase(mockContext, { id: mockId, user: { id: 'user-123567', name: '', email: ''} });

    expect(mockRepo.findById).toHaveBeenCalledWith(mockId);
  });

    it("should deactivate the SHLinkEntity and update it in the repository", async () => {
        await deactivateSHLinksUseCase(mockContext, { id: mockId, user: { id: 'user-123567', name: '', email: ''}  });

    expect(mockRepo.update).toHaveBeenCalledWith(mockUpdatedSHLinkEntity);
  });

    it("should map the updated SHLinkEntity back to SHLinkModel", async () => {
        const result = await deactivateSHLinksUseCase(mockContext, { id: mockId, user: { id: 'user-123567', name: '', email: ''}  });

    expect(mapEntityToModel).toHaveBeenCalledWith(mockUpdatedSHLinkEntity);
    expect(result).toBe(mockReturnedSHLinkModel);
  });

  it("should throw an error if the repository's update method fails", async () => {
    const error = new Error('Test error');
    mockRepo.findById.mockRejectedValue(error);



    await expect(deactivateSHLinksUseCase(mockContext, { id: mockId, user: { id: 'user-123567', name: '', email: ''}  })).rejects
    .toThrow(error);
  
    expect(mockRepo.findById).toHaveBeenCalledWith(mockId);
  });
});
