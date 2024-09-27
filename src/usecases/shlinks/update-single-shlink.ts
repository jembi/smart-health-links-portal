import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkEntity } from '@/entities/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapEntityToModel, mapModelToEntity } from '@/mappers/shlink-mapper';

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

  let model = mapEntityToModel(await context.repo.findOne({ id: data.id }));

  if (data.passcode) {
    model.setConfigPasscode(data.passcode);
  }
  if (data.expiryDate) {
    model.setConfigExp(data.expiryDate);
  }

  await context.validator({
    shlink: model,
    passcode: model.getConfigPasscode(),
  });

  updateShlink = await context.repo.update(mapModelToEntity(model));

  return mapEntityToModel(updateShlink);
};
