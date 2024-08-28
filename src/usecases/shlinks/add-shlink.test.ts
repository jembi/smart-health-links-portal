import { addShlinkUseCase } from "./add-shlink";
import { SHLinkModel } from "@/domain/models/shlink";
import { SHLinkEntity } from "@/entities/shlink";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { mapEntityToModel, mapModelToEntity } from "@/mappers/shlink-mapper";

// Mock the dependencies
jest.mock("@/mappers/shlink-mapper", () => ({
    mapEntityToModel: jest.fn(),
    mapModelToEntity: jest.fn(),
}));

describe("addShlinkUseCase", () => {
    let mockRepo: Partial<jest.Mocked<ISHLinkRepository>>;
    let mockContext: { repo: ISHLinkRepository };
    let mockShlinkModel: SHLinkModel;
    let mockShlinkEntity: SHLinkEntity;
    let mockInsertedShlinkEntity: SHLinkEntity;
    let mockReturnedShlinkModel: SHLinkModel;

    beforeEach(() => {
        // Set up mock repository
        mockRepo = {
            insert: jest.fn(),
            // other methods of ISHLinkRepository can be mocked here if needed
        };

        mockContext = { repo: mockRepo as ISHLinkRepository };

        // Mock the data
        mockShlinkModel = { /* your SHLinkModel data */ } as SHLinkModel;
        mockShlinkEntity = { /* your SHLinkEntity data */ } as SHLinkEntity;
        mockInsertedShlinkEntity = { /* your SHLinkEntity data for the inserted entity */ } as SHLinkEntity;
        mockReturnedShlinkModel = { /* your SHLinkModel data for the returned entity */ } as SHLinkModel;

        // Set up mock implementations
        (mapModelToEntity as jest.Mock).mockReturnValue(mockShlinkEntity);
        (mapEntityToModel as jest.Mock).mockReturnValue(mockReturnedShlinkModel);

        // Set up repo insert method to return the inserted entity
        (mockRepo.insert as jest.Mock).mockResolvedValue(mockInsertedShlinkEntity);
    });

    it("should map the SHLinkModel to SHLinkEntity and set id to undefined and active to true", async () => {
        await addShlinkUseCase(mockContext, { shlink: mockShlinkModel });

        expect(mapModelToEntity).toHaveBeenCalledWith(mockShlinkModel);
        expect(mockShlinkEntity.id).toBeUndefined();
        expect(mockShlinkEntity.active).toBe(true);
    });

    it("should call the repository's insert method with the correct entity", async () => {
        await addShlinkUseCase(mockContext, { shlink: mockShlinkModel });

        expect(mockRepo.insert).toHaveBeenCalledWith(mockShlinkEntity);
    });

    it("should map the inserted SHLinkEntity back to SHLinkModel", async () => {
        const result = await addShlinkUseCase(mockContext, { shlink: mockShlinkModel });

        expect(mapEntityToModel).toHaveBeenCalledWith(mockInsertedShlinkEntity);
        expect(result).toBe(mockReturnedShlinkModel);
    });
});
