import { ServerConfigDto } from '@/domain/dtos/server-config';
import { ServerConfigModel } from '@/domain/models/server-config';
import { ServerConfigEntity } from '@/entities/server_config';

export const mapEntityToModel = (
  serverConfigEntity: ServerConfigEntity,
): ServerConfigModel | undefined => {
  return serverConfigEntity
    ? new ServerConfigModel(
        serverConfigEntity.config_key,
        serverConfigEntity.endpoint_url,
        serverConfigEntity.config_client_id,
        serverConfigEntity.config_client_secret,
        serverConfigEntity.config_token_endpoint,
        serverConfigEntity.refresh_time,
        serverConfigEntity.id,
        serverConfigEntity.access_token_response,
        serverConfigEntity.config_refresh_token,
      )
    : undefined;
};

export const mapModelToEntity = (
  serverModel: ServerConfigModel,
): ServerConfigEntity | undefined => {
  return serverModel
    ? {
        id: serverModel.getId(),
        access_token_response: serverModel.getAccessTokenResponse(),
        endpoint_url: serverModel.getEndpointUrl(),
        config_client_id: serverModel.getClientId(),
        config_client_secret: serverModel.getClientSecret(),
        config_key: serverModel.getConfigKey(),
        config_refresh_token: serverModel.getRefreshToken(),
        config_token_endpoint: serverModel.getTokenEndpoint(),
        refresh_time: serverModel.getRefreshTime(),
      }
    : undefined;
};

export const mapModelToDto = (
  serverModel: ServerConfigModel,
): ServerConfigDto | undefined => {
  return serverModel
    ? {
        id: serverModel.getId(),
        accessTokenResponse: serverModel.getAccessTokenResponse(),
        clientId: serverModel.getClientId(),
        clientSecret: serverModel.getClientSecret(),
        configKey: serverModel.getConfigKey(),
        endpointUrl: serverModel.getEndpointUrl(),
        refreshTime: serverModel.getRefreshTime(),
        refreshToken: serverModel.getRefreshToken(),
        tokenEndpoint: serverModel.getTokenEndpoint(),
      }
    : undefined;
};

export const mapDtoToModel = (
  serverDto: ServerConfigDto,
): ServerConfigModel | undefined => {
  return serverDto
    ? new ServerConfigModel(
        serverDto.configKey,
        serverDto.endpointUrl,
        serverDto.clientId,
        serverDto.clientSecret,
        serverDto.tokenEndpoint,
        serverDto.refreshTime,
        serverDto.id,
        serverDto.accessTokenResponse,
        serverDto.refreshToken,
      )
    : undefined;
};
