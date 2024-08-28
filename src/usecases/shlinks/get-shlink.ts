import { SHLinkModel } from "@/domain/models/shlink";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { mapEntityToModel } from "@/mappers/shlink-mapper";

export const getSHLinkUseCase = async (context: {repo: ISHLinkRepository}, data: {id: string}): Promise<SHLinkModel> => {
    const entity = await context.repo.findById(data.id);

    return mapEntityToModel(entity);
}


export const deactivatedSHLinksUseCase = async (context: {repo: ISHLinkRepository}, data: {id: string}): Promise<SHLinkModel> => {
    const entity = await context.repo.findById(data.id);
    if(entity) entity.active = false;

    return mapEntityToModel(entity);
}

export const activeSHLinksUseCase = async (context: {repo: ISHLinkRepository}, data: {id: string}): Promise<SHLinkModel> => {
    const entity = await context.repo.findById(data.id);
    if(entity) entity.active = true;

    return mapEntityToModel(entity);
}

