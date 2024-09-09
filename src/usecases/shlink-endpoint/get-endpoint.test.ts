import { SHLinkEndpointModel } from "@/domain/models/shlink-endpoint";
import { SHLinkEndpointEntity } from "@/entities/shlink-endpoint";
import { ISHLinkEndpointRepository } from "@/infrastructure/repositories/interfaces/shlink-endpoint-repository";
import { mapEntityToModel } from "@/mappers/shlink-endpoint-mapper";

import { getEndpointUseCase } from './get-endpoint'; 

// Mock the repository
let mockRepo: jest.Mocked<ISHLinkEndpointRepository>;
mockRepo = {
    findOne: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
} as any;

jest.mock('@/mappers/shlink-endpoint-mapper', () => ({
    mapEntityToModel: jest.fn(),
}));

describe('getEndpointUseCase', () => {
    const mockEndpointModel = new SHLinkEndpointModel(
        'shlink-456',
        'config-789',
        '/api/path',
        'endpoint-123'
    );

    const mockEntity: SHLinkEndpointEntity = {
        id: 'endpoint-123',
        shlink_id: 'shlink-456',
        server_config_id: 'config-789',
        url_path: '/api/path',
    };

    it('should return the mapped model when the entity is found by id', async () => {
        (mockRepo.findOne as jest.Mock).mockResolvedValue(mockEntity);
        (mapEntityToModel as jest.Mock).mockReturnValue(mockEndpointModel);

        const result = await getEndpointUseCase({ repo: mockRepo }, { id: 'endpoint-123' });

        expect(mockRepo.findOne).toHaveBeenCalledWith({ id: 'endpoint-123' });
        expect(mapEntityToModel).toHaveBeenCalledWith(mockEntity);
        expect(result).toEqual(mockEndpointModel);
    });

    it('should return the mapped model when the entity is found by shlink id', async () => {
        (mockRepo.findOne as jest.Mock).mockResolvedValue(mockEntity);
        (mapEntityToModel as jest.Mock).mockReturnValue(mockEndpointModel);

        const result = await getEndpointUseCase({ repo: mockRepo }, { shlinkId: 'shlink-123' });

        expect(mockRepo.findOne).toHaveBeenCalledWith({ shlink_id: 'shlink-123' });
        expect(mapEntityToModel).toHaveBeenCalledWith(mockEntity);
        expect(result).toEqual(mockEndpointModel);
    });

    it('should return undefined when the entity is not found', async () => {
        (mockRepo.findOne as jest.Mock).mockResolvedValue(null);
        (mapEntityToModel as jest.Mock).mockReturnValue(undefined);

        const result = await getEndpointUseCase({ repo: mockRepo}, { id: 'non-existent-id' });

        expect(mockRepo.findOne).toHaveBeenCalledWith({ id: 'non-existent-id' });
        expect(mapEntityToModel).toHaveBeenCalledWith(null);
        expect(result).toBeUndefined();
    });

    it('should handle the case where mapping the entity to a model fails', async () => {
        (mockRepo.findOne as jest.Mock).mockResolvedValue(mockEntity);
        (mapEntityToModel as jest.Mock).mockReturnValue(undefined);

        const result = await getEndpointUseCase({ repo: mockRepo }, { id: 'endpoint-123' });

        expect(mockRepo.findOne).toHaveBeenCalledWith({ id: 'endpoint-123' });
        expect(mapEntityToModel).toHaveBeenCalledWith(mockEntity);
        expect(result).toBeUndefined();
    });
});
