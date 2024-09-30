import { AccessTicketModel } from '@/domain/models/access-ticket';
import { AccessTicketEntity } from '@/entities/access-ticket';

export const mapEntityToModel = (
  accessTicketEntity: AccessTicketEntity,
): AccessTicketModel | undefined => {
  if (!accessTicketEntity) return undefined;
  const { shlink_id, id, created_at, updated_at } = accessTicketEntity;
  return new AccessTicketModel(shlink_id, id, created_at, updated_at);
};

export const mapModelToEntity = (
  accessTicketModel: AccessTicketModel,
): AccessTicketEntity | undefined => {
  if (!accessTicketModel) return undefined;
  return {
    id: accessTicketModel.getId(),
    shlink_id: accessTicketModel.getSHLinkId(),
  };
};
