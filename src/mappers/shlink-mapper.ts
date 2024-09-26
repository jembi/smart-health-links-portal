import { EXTERNAL_URL } from '@/app/constants/http-constants';
import { SHLinkDto, SHLinkMiniDto } from '@/domain/dtos/shlink';
import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkEndpointModel } from '@/domain/models/shlink-endpoint';
import { SHLinkEntity } from '@/entities/shlink';

export const mapEntityToModel = (
  shlinkEntity: SHLinkEntity,
): SHLinkModel | undefined => {
  return shlinkEntity
    ? new SHLinkModel(
        shlinkEntity.user_id,
        shlinkEntity.name,
        shlinkEntity.passcode_failures_remaining,
        shlinkEntity.active,
        shlinkEntity.management_token,
        shlinkEntity.config_passcode,
        shlinkEntity.config_exp,
        shlinkEntity.id,
        shlinkEntity.created_at,
        shlinkEntity.updated_at,
        shlinkEntity.deleted_at
      )
    : undefined;
};

export const mapModelToEntity = (
  shlinkModel: SHLinkModel,
): SHLinkEntity | undefined => {
  return shlinkModel
    ? {
        id: shlinkModel.getId(),
        name: shlinkModel.getName(),
        user_id: shlinkModel.getUserId(),
        passcode_failures_remaining: shlinkModel.getPasscodeFailuresRemaining(),
        active: shlinkModel.getActive(),
        management_token: shlinkModel.getManagementToken(),
        config_passcode: shlinkModel.getConfigPasscode(),
        config_exp: shlinkModel.getConfigExp(),
        created_at: shlinkModel.getCreatedAt(),
        updated_at: shlinkModel.getUpdatedAt(),
        deleted_at: shlinkModel.getDeletedAt()
      }
    : undefined;
};

export const mapModelToDto = (
  shlinkModel: SHLinkModel,
): SHLinkDto | undefined => {
  return shlinkModel
    ? {
        id: shlinkModel.getId(),
        name: shlinkModel.getName(),
        passcodeFailuresRemaining: shlinkModel.getPasscodeFailuresRemaining(),
        active: shlinkModel.getActive(),
        managementToken: shlinkModel.getManagementToken(),
        configPasscode: shlinkModel.getConfigPasscode(),
        configExp: shlinkModel.getConfigExp(),
        userId: shlinkModel.getUserId(),
        createdAt: shlinkModel.getCreatedAt(),
        updatedAt: shlinkModel.getUpdatedAt(),
        deletedAt: shlinkModel.getDeletedAt()
      }
    : undefined;
};

export const mapModelToMiniDto = (
  shlinkModel: SHLinkModel,
  files?: SHLinkEndpointModel[],
  ticket?: string,
): SHLinkMiniDto | undefined => {
  return shlinkModel
    ? {
        id: shlinkModel.getId(),
        name: shlinkModel.getName(),
        managementToken: shlinkModel.getManagementToken(),
        expiryDate: shlinkModel.getConfigExp(),
        passwordRequired: !!shlinkModel.getConfigPasscode(),
        url: encodeSHLink(shlinkModel),
        active: shlinkModel.getActive(),
        files: files?.map((x) => {
          return {
            location: `${EXTERNAL_URL}/api/v1/share-links/${shlinkModel.getId()}/endpoints/${x.getId()}?ticket=${ticket}`,
            contentType: 'application/smart-api-access',
            embedded: null,
          };
        }),
      }
    : undefined;
};

export const mapDtoToModel = (
  shlinkDto: SHLinkDto,
): SHLinkModel | undefined => {
  return shlinkDto
    ? new SHLinkModel(
        shlinkDto.userId,
        shlinkDto.name,
        shlinkDto.passcodeFailuresRemaining,
        shlinkDto.active,
        shlinkDto.managementToken,
        shlinkDto.configPasscode,
        shlinkDto.configExp ? new Date(shlinkDto.configExp) : null,
        shlinkDto.id,
        shlinkDto.createdAt,
        shlinkDto.updatedAt,
        shlinkDto.deletedAt
      )
    : undefined;
};

export const encodeSHLink = (shlink: SHLinkModel): string => {
  const result = {
    label: shlink.getName(),
    url: `${EXTERNAL_URL}/api/v1/share-links/${shlink.getId()}`,
    flag: `${!shlink.getConfigExp() ? 'L' : ''}${shlink.getConfigPasscode() ? 'P' : ''}`,
  };
  const data = Buffer.from(JSON.stringify(result), 'utf8').toString('base64');

  return `${EXTERNAL_URL}/viewer#shlink:/${data}`;
};
