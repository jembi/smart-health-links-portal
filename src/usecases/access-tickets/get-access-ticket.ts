import { AccessTicketModel } from '@/domain/models/access-ticket';
import { IAccessTicketRepository } from '@/infrastructure/repositories/interfaces/access-ticket-repository.interface';
import { mapEntityToModel } from '@/mappers/access-ticket-mapper';

export const getAccessTicketUseCase = async (
  context: { repo: IAccessTicketRepository },
  id: string,
): Promise<AccessTicketModel> => {
  const newEntity = await context.repo.findById(id);

  return mapEntityToModel(newEntity);
};
