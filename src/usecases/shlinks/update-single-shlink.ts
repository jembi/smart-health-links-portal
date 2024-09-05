import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkEntity } from '@/entities/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapEntityToModel } from '@/mappers/shlink-mapper';

export const updateSingleSHLinkUseCase = async (
  context: { repo: ISHLinkRepository },
  data: { id: string; shlink: SHLinkModel },
): Promise<SHLinkModel> => {
  let newShlink: SHLinkEntity;

  let entity = await context.repo.findOne({ id: data.id });

  if (data.shlink.getConfigPasscode()) {
    entity.config_passcode = data.shlink.getConfigPasscode();
  }
  if (data.shlink.getConfigExp()) {
    entity.config_exp = data.shlink.getConfigExp();
  }

  newShlink = await context.repo.update(entity);

  return mapEntityToModel(newShlink);
};
