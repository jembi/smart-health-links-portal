import { SHLinkModel } from '@/domain/models/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapEntityToModel } from '@/mappers/shlink-mapper';

export const getSHLinkUseCase = async (
  context: { repo: ISHLinkRepository },
  data: { user_id: string },
): Promise<SHLinkModel[]> => {
  const entities = await context.repo.findMany({ user_id: data.user_id });

  return entities.map(x => mapEntityToModel(x));
};
