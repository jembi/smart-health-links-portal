import { SHLinkModel } from "@/domain/models/shlink";
import { SHLinkEntity } from "@/entities/shlink";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { mapEntityToModel, mapModelToEntity } from "@/mappers/shlink-mapper";

export const addShlinkUseCase = async (context: {repo: ISHLinkRepository}, data: {shlink: SHLinkModel}): Promise<SHLinkModel> => {
    let newShlink: SHLinkEntity;
    
    let entity = mapModelToEntity(data.shlink);
    entity.id = undefined;
    entity.active = true;

    newShlink = await context.repo.insert(entity);     

    return mapEntityToModel(newShlink);
}