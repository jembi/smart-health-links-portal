import { SHLinkEndpointModel } from '@/domain/models/shlink-endpoint';
import { SHLinkEndpointEntity } from '@/entities/shlink-endpoint';
import { ISHLinkEndpointRepository } from '@/infrastructure/repositories/interfaces/shlink-endpoint-repository';
import {
  mapEntityToModel,
  mapModelToEntity,
} from '@/mappers/shlink-endpoint-mapper';

import { addEndpointUseCase } from './add-endpoint';

// Mock the repository
let mockRepo: jest.Mocked<ISHLinkEndpointRepository>;
mockRepo = {
  findOne: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
} as any;

jest.mock('@/mappers/shlink-endpoint-mapper', () => ({
  mapEntityToModel: jest.fn(),
  mapModelToEntity: jest.fn(),
}));

describe('addEndpointUseCase', () => {
  const mockEndpointModel = new SHLinkEndpointModel(
    'shlink-456',
    'config-789',
    '/api/path',
  );

  const mockEntity: SHLinkEndpointEntity = {
    id: 'endpoint-123',
    shlink_id: 'shlink-456',
    server_config_id: 'config-789',
    url_path: '/api/path',
  };

  it('should insert a new endpoint if none exists for the given shlink_id', async () => {
    (mockRepo.findOne as jest.Mock).mockResolvedValue(null); // No existing endpoint
    (mockRepo.insert as jest.Mock).mockResolvedValue(mockEntity);
    (mapModelToEntity as jest.Mock).mockReturnValue(mockEntity);
    (mapEntityToModel as jest.Mock).mockReturnValue(mockEndpointModel);

    const result = await addEndpointUseCase(
      { repo: mockRepo },
      { endpoint: mockEndpointModel },
    );

    expect(mockRepo.findOne).toHaveBeenCalledWith({ shlink_id: 'shlink-456' });
    expect(mockRepo.insert).toHaveBeenCalledWith(mockEntity);
    expect(mapEntityToModel).toHaveBeenCalledWith(mockEntity);
    expect(result).toEqual(mockEndpointModel);
  });

  it('should update an existing endpoint if one is found for the given shlink_id', async () => {
    const existingEntity: SHLinkEndpointEntity = {
      ...mockEntity,
      id: 'existing-endpoint-id',
    };

    (mockRepo.findOne as jest.Mock).mockResolvedValue(existingEntity); // Existing endpoint
    (mockRepo.update as jest.Mock).mockResolvedValue(existingEntity);
    (mapModelToEntity as jest.Mock).mockReturnValue(existingEntity);
    (mapEntityToModel as jest.Mock).mockReturnValue(mockEndpointModel);

    const result = await addEndpointUseCase(
      { repo: mockRepo },
      { endpoint: mockEndpointModel },
    );

    expect(mockRepo.findOne).toHaveBeenCalledWith({ shlink_id: 'shlink-456' });
    expect(mockRepo.update).toHaveBeenCalledWith(existingEntity);
    expect(mapEntityToModel).toHaveBeenCalledWith(existingEntity);
    expect(result).toEqual(mockEndpointModel);
  });
});
