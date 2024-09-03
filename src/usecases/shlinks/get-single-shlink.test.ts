import { getSingleSHLinkUseCase } from "./get-single-shlink";
import { SHLinkEntity } from "@/entities/shlink";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { SHLinkModel } from "@/domain/models/shlink";
import { mapEntityToModel } from "@/mappers/shlink-mapper";

// Mock the dependencies
jest.mock("@/mappers/shlink-mapper", () => ({
    mapEntityToModel: jest.fn(),
}));

describe("getSingleSHLinkUseCase", () => {
    let mockRepo: Partial<jest.Mocked<ISHLinkRepository>>;
    let mockContext: { repo: ISHLinkRepository };
    let mockSHLinkEntity: SHLinkEntity;
    let mockReturnedSHLinkModel: SHLinkModel;
    let mockId: string;

    beforeEach(() => {
        mockRepo = {
            findOne: jest.fn(),
        };

        mockContext = { repo: mockRepo as ISHLinkRepository };

        mockId = "1234567890";

        // Mock entity data
        mockSHLinkEntity = {
            id: mockId,
            user_id: "user-123567",
            passcode_failures_remaining: 3,
            active: true,
            management_token: "token-xyz1234",
            config_passcode: "passcode-abcde",
            config_exp: new Date("2024-01-01T00:00:00Z"),
        };

        // Mock model data
        mockReturnedSHLinkModel = new SHLinkModel(
            mockSHLinkEntity.user_id,
            mockSHLinkEntity.passcode_failures_remaining,
            mockSHLinkEntity.active,
            mockSHLinkEntity.management_token,
            mockSHLinkEntity.config_passcode,
            mockSHLinkEntity.config_exp,
            mockSHLinkEntity.id
        );

        // Set up mock implementations
        (mockRepo.findOne as jest.Mock).mockResolvedValue(mockSHLinkEntity);
        (mapEntityToModel as jest.Mock).mockReturnValue(mockReturnedSHLinkModel);
    });

    it("should call the repository's findOne method with the correct id", async () => {
        await getSingleSHLinkUseCase(mockContext, { id: mockId , managementToken: mockSHLinkEntity.management_token});

        expect(mockRepo.findOne).toHaveBeenCalledWith({ id: mockId , management_token: mockSHLinkEntity.management_token});
    });

    it("should map the SHLinkEntity to SHLinkModel", async () => {
        const result = await getSingleSHLinkUseCase(mockContext, { id: mockId, managementToken: mockSHLinkEntity.management_token });

        expect(mapEntityToModel).toHaveBeenCalledWith(mockSHLinkEntity);
        expect(result).toBe(mockReturnedSHLinkModel);
    });

    it("should throw an error if the repository's findOne method fails", async () => {
        const errorMessage = "Repository findOne failure";
        (mockRepo.findOne as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await expect(getSingleSHLinkUseCase(mockContext, { id: mockId, managementToken: mockSHLinkEntity.management_token })).rejects.toThrow(errorMessage);
    });
});
