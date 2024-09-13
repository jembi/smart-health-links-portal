import { AccessTicketModel } from '@/domain/models/access-ticket';
import { IAccessTicketRepository } from '@/infrastructure/repositories/interfaces/access-ticket-repository.interface';
import {
  mapEntityToModel,
  mapModelToEntity,
} from '@/mappers/access-ticket-mapper';

export const addAccessTicketUseCase = async (
  context: { repo: IAccessTicketRepository },
  data: AccessTicketModel,
): Promise<AccessTicketModel> => {
  const newEntity = await context.repo.insert(mapModelToEntity(data));

  return mapEntityToModel(newEntity);
};
