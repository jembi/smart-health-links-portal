import { SHLinkEndpointDto } from '@/domain/dtos/shlink-endpoint';
import { SHLinkEndpointModel } from '@/domain/models/shlink-endpoint';
import { SHLinkEndpointEntity } from '@/entities/shlink-endpoint';

import { mapEntityToModel, mapModelToEntity, mapModelToDto, mapDtoToModel } from './shlink-endpoint-mapper';

describe('SHLinkEndpoint Mappers', () => {
  
  const mockEntity: SHLinkEndpointEntity = {
    id: 'endpoint-123',
    shlink_id: 'shlink-456',
    server_config_id: 'config-789',
    url_path: '/api/path'
  };

  const mockModel = new SHLinkEndpointModel(
    'shlink-456',
    'config-789',
    '/api/path',
    'endpoint-123'
  );

  const mockDto: SHLinkEndpointDto = {
    id: 'endpoint-123',
    shlinkId: 'shlink-456',
    serverConfigId: 'config-789',
    urlPath: '/api/path'
  };

  describe('mapEntityToModel', () => {
    it('should map SHLinkEndpointEntity to SHLinkEndpointModel', () => {
      const result = mapEntityToModel(mockEntity);
      expect(result).toBeInstanceOf(SHLinkEndpointModel);
    });

    it('should return undefined if SHLinkEndpointEntity is undefined', () => {
      const result = mapEntityToModel(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('mapModelToEntity', () => {
    it('should map SHLinkEndpointModel to SHLinkEndpointEntity', () => {
      const result = mapModelToEntity(mockModel);
      expect(result).toEqual(mockEntity);
    });

    it('should return undefined if SHLinkEndpointModel is undefined', () => {
      const result = mapModelToEntity(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('mapModelToDto', () => {
    it('should map SHLinkEndpointModel to SHLinkEndpointDto', () => {
      const result = mapModelToDto(mockModel);
      expect(result).toEqual(mockDto);
    });

    it('should return undefined if SHLinkEndpointModel is undefined', () => {
      const result = mapModelToDto(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('mapDtoToModel', () => {
    it('should map SHLinkEndpointDto to SHLinkEndpointModel', () => {
      const result = mapDtoToModel(mockDto);
      expect(result).toBeInstanceOf(SHLinkEndpointModel);
    });

    it('should return undefined if SHLinkEndpointDto is undefined', () => {
      const result = mapDtoToModel(undefined);
      expect(result).toBeUndefined();
    });
  });
});
