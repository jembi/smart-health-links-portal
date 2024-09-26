import { AccessTicketModel } from '@/domain/models/access-ticket';
import { AccessTicketEntity } from '@/entities/access-ticket';

export const mapEntityToModel = (
  accessTicketEntity: AccessTicketEntity,
): AccessTicketModel | undefined => {
  return accessTicketEntity
    ? new AccessTicketModel(
      accessTicketEntity.shlink_id, 
      accessTicketEntity.id,
      accessTicketEntity.created_at,
      accessTicketEntity.updated_at
    )
    : undefined;
};

export const mapModelToEntity = (
  accessTicketModel: AccessTicketModel,
): AccessTicketEntity | undefined => {
  return accessTicketModel
    ? {
        id: accessTicketModel.getId(),
        shlink_id: accessTicketModel.getSHLinkId(),
        created_at: accessTicketModel.getCreatedAt(),
        updated_at: accessTicketModel.getUpdatedAt()
      }
    : undefined;
};
