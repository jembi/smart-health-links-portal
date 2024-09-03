import { ServerConfigDto } from '@/domain/dtos/server-config';
import { ServerConfigModel } from '@/domain/models/server-config';
import { ServerConfigEntity } from '@/entities/server_config';
import {
  mapEntityToModel,
  mapModelToEntity,
  mapModelToDto,
  mapDtoToModel,
} from '@/mappers/server-config-mapper';

const refreshTime = new Date();

describe('ServerConfig Mappers', () => {
  const serverConfigEntity: ServerConfigEntity = {
    id: 'entity-id',
    config_key: 'entity-key',
    endpoint_url: 'http://entity-url.com',
    config_client_id: 'entity-client-id',
    config_client_secret: 'entity-client-secret',
    config_token_endpoint: 'http://entity-token-endpoint',
    refresh_time: refreshTime,
    access_token_response: 'entity-access-token',
    config_refresh_token: 'entity-refresh-token',
  };

  const serverConfigModel = new ServerConfigModel(
    'entity-key',
    'http://entity-url.com',
    'entity-client-id',
    'entity-client-secret',
    'http://entity-token-endpoint',
    refreshTime,
    'entity-id',
    'entity-access-token',
    'entity-refresh-token',
  );

  const serverConfigDto: ServerConfigDto = {
    id: 'dto-id',
    accessTokenResponse: 'dto-access-token',
    clientId: 'dto-client-id',
    clientSecret: 'dto-client-secret',
    configKey: 'dto-key',
    endpointUrl: 'http://dto-url.com',
    refreshTime: refreshTime,
    refreshToken: 'dto-refresh-token',
    tokenEndpoint: 'http://dto-token-endpoint',
  };

  describe('mapEntityToModel', () => {
    it('should map a ServerConfigEntity to a ServerConfigModel', () => {
      const result = mapEntityToModel(serverConfigEntity);
      expect(result).toBeInstanceOf(ServerConfigModel);
      expect(result?.getId()).toBe(serverConfigEntity.id);
      expect(result?.getConfigKey()).toBe(serverConfigEntity.config_key);
      expect(result?.getEndpointUrl()).toBe(serverConfigEntity.endpoint_url);
      expect(result?.getClientId()).toBe(serverConfigEntity.config_client_id);
      expect(result?.getClientSecret()).toBe(
        serverConfigEntity.config_client_secret,
      );
      expect(result?.getTokenEndpoint()).toBe(
        serverConfigEntity.config_token_endpoint,
      );
      expect(result?.getRefreshTime()).toBe(serverConfigEntity.refresh_time);
      expect(result?.getAccessTokenResponse()).toBe(
        serverConfigEntity.access_token_response,
      );
      expect(result?.getRefreshToken()).toBe(
        serverConfigEntity.config_refresh_token,
      );
    });

    it('should return undefined if ServerConfigEntity is undefined', () => {
      const result = mapEntityToModel(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('mapModelToEntity', () => {
    it('should map a ServerConfigModel to a ServerConfigEntity', () => {
      const result = mapModelToEntity(serverConfigModel);
      expect(result).toEqual({
        id: serverConfigModel.getId(),
        config_key: serverConfigModel.getConfigKey(),
        endpoint_url: serverConfigModel.getEndpointUrl(),
        config_client_id: serverConfigModel.getClientId(),
        config_client_secret: serverConfigModel.getClientSecret(),
        config_token_endpoint: serverConfigModel.getTokenEndpoint(),
        refresh_time: serverConfigModel.getRefreshTime(),
        access_token_response: serverConfigModel.getAccessTokenResponse(),
        config_refresh_token: serverConfigModel.getRefreshToken(),
      });
    });

    it('should return undefined if ServerConfigModel is undefined', () => {
      const result = mapModelToEntity(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('mapModelToDto', () => {
    it('should map a ServerConfigModel to a ServerConfigDto', () => {
      const result = mapModelToDto(serverConfigModel);
      expect(result).toEqual({
        id: serverConfigModel.getId(),
        accessTokenResponse: serverConfigModel.getAccessTokenResponse(),
        clientId: serverConfigModel.getClientId(),
        clientSecret: serverConfigModel.getClientSecret(),
        configKey: serverConfigModel.getConfigKey(),
        endpointUrl: serverConfigModel.getEndpointUrl(),
        refreshTime: serverConfigModel.getRefreshTime(),
        refreshToken: serverConfigModel.getRefreshToken(),
        tokenEndpoint: serverConfigModel.getTokenEndpoint(),
      });
    });

    it('should return undefined if ServerConfigModel is undefined', () => {
      const result = mapModelToDto(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('mapDtoToModel', () => {
    it('should map a ServerConfigDto to a ServerConfigModel', () => {
      const result = mapDtoToModel(serverConfigDto);
      expect(result).toBeInstanceOf(ServerConfigModel);
      expect(result?.getId()).toBe(serverConfigDto.id);
      expect(result?.getConfigKey()).toBe(serverConfigDto.configKey);
      expect(result?.getEndpointUrl()).toBe(serverConfigDto.endpointUrl);
      expect(result?.getClientId()).toBe(serverConfigDto.clientId);
      expect(result?.getClientSecret()).toBe(serverConfigDto.clientSecret);
      expect(result?.getTokenEndpoint()).toBe(serverConfigDto.tokenEndpoint);
      expect(result?.getRefreshTime()).toBe(serverConfigDto.refreshTime);
      expect(result?.getAccessTokenResponse()).toBe(
        serverConfigDto.accessTokenResponse,
      );
      expect(result?.getRefreshToken()).toBe(serverConfigDto.refreshToken);
    });

    it('should return undefined if ServerConfigDto is undefined', () => {
      const result = mapDtoToModel(undefined);
      expect(result).toBeUndefined();
    });
  });
});
