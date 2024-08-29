import { SHLinkModel } from "@/domain/models/shlink";
import { SHLinkEntity } from "@/entities/shlink";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { mapEntityToModel } from "@/mappers/shlink-mapper";


export const deactivateSHLinksUseCase = async (context: {repo: ISHLinkRepository}, data: {id: string}): Promise<SHLinkModel> => {
    const entity = await context.repo.findById(data.id);
    let newShlink: SHLinkEntity

    if(entity) {
        entity.active = false;
        newShlink = await context.repo.update(entity); 
    }

    return mapEntityToModel(newShlink);
}
