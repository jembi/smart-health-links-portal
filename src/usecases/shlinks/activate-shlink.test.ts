import { SHLinkModel } from "@/domain/models/shlink";
import { SHLinkEntity } from "@/entities/shlink";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { mapEntityToModel } from "@/mappers/shlink-mapper";

import { activeSHLinksUseCase } from "./activate-shlink";

// Mock the dependencies
jest.mock("@/mappers/shlink-mapper", () => ({
    mapEntityToModel: jest.fn(),
}));

describe("activeSHLinksUseCase", () => {
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

        mockId = "1234567890";

        // Mock entity data
        mockSHLinkEntity = {
            id: mockId,
            name: 'name',
            user_id: "user-123567",
            passcode_failures_remaining: 3,
            active: false,
            management_token: "token-xyz1234",
            config_passcode: "passcode-abcde",
            config_exp: new Date("2024-01-01T00:00:00Z"),
        };

        mockUpdatedSHLinkEntity = {
            ...mockSHLinkEntity,
            active: true, // Entity should be activated
        };

        mockReturnedSHLinkModel = new SHLinkModel(
            mockSHLinkEntity.user_id,
            mockSHLinkEntity.name,
            mockSHLinkEntity.passcode_failures_remaining,
            mockUpdatedSHLinkEntity.active,
            mockSHLinkEntity.management_token,
            mockSHLinkEntity.config_passcode,
            mockSHLinkEntity.config_exp,
            mockSHLinkEntity.id
        );

        // Set up mock implementations
        (mockRepo.findById as jest.Mock).mockResolvedValue(mockSHLinkEntity);
        (mockRepo.update as jest.Mock).mockResolvedValue(mockUpdatedSHLinkEntity);
        (mapEntityToModel as jest.Mock).mockReturnValue(mockReturnedSHLinkModel);
    });

    it("should call the repository's findById method with the correct id", async () => {
        await activeSHLinksUseCase(mockContext, { id: mockId });

        expect(mockRepo.findById).toHaveBeenCalledWith(mockId);
    });

    it("should activate the SHLinkEntity and update it in the repository", async () => {
        await activeSHLinksUseCase(mockContext, { id: mockId });

        expect(mockRepo.update).toHaveBeenCalledWith(mockUpdatedSHLinkEntity);
    });

    it("should map the updated SHLinkEntity back to SHLinkModel", async () => {
        const result = await activeSHLinksUseCase(mockContext, { id: mockId });

        expect(mapEntityToModel).toHaveBeenCalledWith(mockUpdatedSHLinkEntity);
        expect(result).toBe(mockReturnedSHLinkModel);
    });

    it("should throw an error if the repository's update method fails", async () => {
        const errorMessage = "Repository update failure";
        (mockRepo.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await expect(activeSHLinksUseCase(mockContext, { id: mockId })).rejects.toThrow(errorMessage);
    });
});
