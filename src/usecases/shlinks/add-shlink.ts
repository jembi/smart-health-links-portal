import { ShlinkModel } from "@/domain/models/shlink";
import { SHLinkEntity } from "@/entities/shlink";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { mapEntityToModel, mapModelToEntity } from "@/mappers/shlink-mapper";

export const addShlinkUseCase = async (context: {repo: ISHLinkRepository}, data: {shlink: ShlinkModel}): Promise<ShlinkModel> => {
    const oldShlink = await context.repo.findOne({id: data.shlink.getId()});
    let newShlink: SHLinkEntity;
    
    let entity = mapModelToEntity(data.shlink);

    if(!oldShlink){
        newShlink = await context.repo.insert(entity);
    }  
    else{
      newShlink = await context.repo.update(entity);
    }        

    return mapEntityToModel(newShlink);
}