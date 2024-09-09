import { AuthenticationError, UserProfile } from "@/app/utils/authentication";
import { SHLinkModel } from "@/domain/models/shlink";
import { SHLinkEntity } from "@/entities/shlink";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { mapEntityToModel } from "@/mappers/shlink-mapper";

export const deactivateSHLinksUseCase = async (
  context: { repo: ISHLinkRepository },
  data: { id: string, user: UserProfile },
): Promise<SHLinkModel> => {
  const entity = await context.repo.findById(data.id);
  let newShlink: SHLinkEntity;

  if(entity) {
    if(data.user.id !== entity.user_id) throw new AuthenticationError();

        entity.active = false;
        newShlink = await context.repo.update(entity); 
  }

  return mapEntityToModel(newShlink);
}
