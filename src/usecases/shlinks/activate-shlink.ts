
import { AuthenticationError, UserProfile } from '@/app/utils/authentication';
import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkEntity } from '@/entities/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapEntityToModel, mapModelToEntity } from '@/mappers/shlink-mapper';

export const activateSHLinksUseCase = async (
  context: { repo: ISHLinkRepository },
  data: { id: string; user: UserProfile },
): Promise<SHLinkModel> => {
  const model = mapEntityToModel(await context.repo.findById(data.id));

  let newShlink: SHLinkEntity;

  if (model) {
    if (data.user.id !== model.getUserId())
      throw new AuthenticationError(
        'User not authorized to activate shlink.',
      );

    model.setActive(true);
    newShlink = await context.repo.update(mapModelToEntity(model));
  }

  return mapEntityToModel(newShlink);
};
