import { SHLinkEndpointModel } from '@/domain/models/shlink-endpoint';
import { ISHLinkEndpointRepository } from '@/infrastructure/repositories/interfaces/shlink-endpoint-repository';
import { mapEntityToModel } from '@/mappers/shlink-endpoint-mapper';

export const getEndpointUseCase = async (
  context: { repo: ISHLinkEndpointRepository },
  data: { id?: string; shlinkId?: string },
): Promise<SHLinkEndpointModel> => {
  const entity = await context.repo.findOne({
    ...(data.id ? { id: data.id } : {}),
    ...(data.shlinkId ? { shlink_id: data.shlinkId } : {}),
  });

  return mapEntityToModel(entity);
};
