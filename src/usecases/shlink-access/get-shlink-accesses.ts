import { SHLinkAccessModel } from '@/domain/models/shlink-access';
import { ISHLinkAccessRepository } from '@/infrastructure/repositories/interfaces/shlink-access-repository';
import { mapEntityToModel } from '@/mappers/shlink-access-mapper';

export const getSHLinkAccessesUseCase = async (
  context: { repo: ISHLinkAccessRepository },
  data: { shlinkId: string },
): Promise<SHLinkAccessModel[]> => {
  const shlinkAccesses = await context.repo.findMany({
    shlink_id: data.shlinkId,
  });

  return shlinkAccesses.map((x) => mapEntityToModel(x));
};
