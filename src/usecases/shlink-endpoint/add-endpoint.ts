import { SHLinkEndpointModel } from "@/domain/models/shlink-endpoint";
import { SHLinkEndpointEntity } from "@/entities/shlink-endpoint";
import { ISHLinkEndpointRepository } from "@/infrastructure/repositories/interfaces/shlink-endpoint-repository";
import { mapEntityToModel, mapModelToEntity } from "@/mappers/shlink-endpoint-mapper";

export const addEndpointUseCase = async (context: {repo: ISHLinkEndpointRepository}, data: {endpoint: SHLinkEndpointModel}): Promise<SHLinkEndpointModel> => {
    const oldSHLinkEndpoint = await context.repo.findOne({shlink_id: data.endpoint.getShlinkId()});
    let newSHLinkEndpoint: SHLinkEndpointEntity;
    
    let entity = mapModelToEntity(data.endpoint);

    if (!oldSHLinkEndpoint) {
        entity.id = undefined
        newSHLinkEndpoint = await context.repo.insert(entity);
    } 
    else {
        entity = {
            ...entity,
            id: oldSHLinkEndpoint.id
        }
        newSHLinkEndpoint = await context.repo.update(entity);
    }
   
    return mapEntityToModel(newSHLinkEndpoint);
}