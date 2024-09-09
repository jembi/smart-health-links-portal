import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkEntity } from '@/entities/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapEntityToModel } from '@/mappers/shlink-mapper';

export const updateSingleSHLinkUseCase = async (
  context: {
    repo: ISHLinkRepository;
    validator: ({
      shlink,
      passcode,
    }: {
      shlink: SHLinkModel;
      passcode?: string;
    }) => boolean;
  },
  data: { id: string; passcode?: string; expiryDate?: Date },
): Promise<SHLinkModel> => {
  let updateShlink: SHLinkEntity;

  let entity = await context.repo.findOne({ id: data.id });

  if (data.passcode) {
    entity.config_passcode = data.passcode;
  }
  if (data.expiryDate) {
    entity.config_exp = data.expiryDate;
  }

  await context.validator({
    shlink: mapEntityToModel(entity),
    passcode: entity.config_passcode,
  });

  updateShlink = await context.repo.update(entity);

  return mapEntityToModel(updateShlink);
};
