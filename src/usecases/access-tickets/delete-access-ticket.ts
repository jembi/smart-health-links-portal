import { AccessTicketModel } from '@/domain/models/access-ticket';
import { IAccessTicketRepository } from '@/infrastructure/repositories/interfaces/access-ticket-repository.interface';
import { mapEntityToModel } from '@/mappers/access-ticket-mapper';

export const deleteAccessTicketUseCase = async (
  context: { repo: IAccessTicketRepository },
  data: { id: string },
): Promise<AccessTicketModel | undefined> => {
  const entity = await context.repo.findById(data.id);

  if (!entity) return undefined;

  await context.repo.delete(entity);
  return mapEntityToModel(entity);
};
