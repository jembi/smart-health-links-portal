import { SHLinkAccessModel } from '@/domain/models/shlink-access';
import { SHLinkAccessEntity } from '@/entities/shlink-access';

export const mapModelToEntity = (
  shlinkAccessModel?: SHLinkAccessModel,
): SHLinkAccessEntity | undefined => {
  return shlinkAccessModel
    ? {
        access_time: shlinkAccessModel.getAccessTime(),
        recipient: shlinkAccessModel.getRecipient(),
        shlink_id: shlinkAccessModel.getSHLinkId(),
        id: shlinkAccessModel.getId(),
      }
    : undefined;
};
