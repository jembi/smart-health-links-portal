import { SHLinkEndpointDto } from '@/domain/dtos/shlink-endpoint';
import { SHLinkEndpointModel } from '@/domain/models/shlink-endpoint';
import { SHLinkEndpointEntity } from '@/entities/shlink-endpoint';

export const mapEntityToModel = (
  shlinkEndpointEntity: SHLinkEndpointEntity,
): SHLinkEndpointModel | undefined => {
  return shlinkEndpointEntity
    ? new SHLinkEndpointModel(
        shlinkEndpointEntity.shlink_id,
        shlinkEndpointEntity.server_config_id,
        shlinkEndpointEntity.url_path,
        shlinkEndpointEntity.id,
        shlinkEndpointEntity.created_at,
        shlinkEndpointEntity.updated_at,
      )
    : undefined;
};

export const mapModelToEntity = (
  shlinkEndpointModel: SHLinkEndpointModel,
): SHLinkEndpointEntity | undefined => {
  return shlinkEndpointModel
    ? {
        id: shlinkEndpointModel.getId(),
        shlink_id: shlinkEndpointModel.getShlinkId(),
        server_config_id: shlinkEndpointModel.getServerConfigId(),
        url_path: shlinkEndpointModel.getUrlPath()
      }
    : undefined;
};

export const mapModelToDto = (
  shlinkEndpointModel: SHLinkEndpointModel,
): SHLinkEndpointDto | undefined => {
  return shlinkEndpointModel
    ? {
        id: shlinkEndpointModel.getId(),
        shlinkId: shlinkEndpointModel.getShlinkId(),
        serverConfigId: shlinkEndpointModel.getServerConfigId(),
        urlPath: shlinkEndpointModel.getUrlPath()
      }
    : undefined;
};

export const mapDtoToModel = (
  shlinkEndpointDto: SHLinkEndpointDto,
): SHLinkEndpointModel | undefined => {
  return shlinkEndpointDto
    ? new SHLinkEndpointModel(
        shlinkEndpointDto.shlinkId,
        shlinkEndpointDto.serverConfigId,
        shlinkEndpointDto.urlPath,
        shlinkEndpointDto.id
      )
    : undefined;
};
