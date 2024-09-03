import { SHLinkAccessModel } from "@/domain/models/shlink-access";
import { ISHLinkAccessRepository } from "@/infrastructure/repositories/interfaces/shlink-access-repository";
import { mapModelToEntity } from "@/mappers/shlink-access-mapper";

export const logSHLinkAccessUseCase = async(context: {repo: ISHLinkAccessRepository}, data: SHLinkAccessModel): Promise<void> => {
    context.repo.insert(mapModelToEntity(data));
}
