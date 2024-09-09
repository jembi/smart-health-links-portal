import { SHLinkModel } from '@/domain/models/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapEntityToModel } from '@/mappers/shlink-mapper';

export const getSingleSHLinkUseCase = async (
  context: { repo: ISHLinkRepository },
  data: { id: string; managementToken?: string },
): Promise<SHLinkModel> => {
  const entity = await context.repo.findOne({
    id: data.id,
    ...(data.managementToken ? { management_token: data.managementToken } : {}),
  });

  return mapEntityToModel(entity);
};
