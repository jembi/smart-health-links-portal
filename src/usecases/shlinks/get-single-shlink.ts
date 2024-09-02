import { SHLinkModel } from '@/domain/models/shlink';
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { mapEntityToModel } from "@/mappers/shlink-mapper";

export const getSingleSHLinkUseCase = async (context: {repo: ISHLinkRepository}, data: {id: string}): Promise<SHLinkModel> => {
    const entity = await context.repo.findById(data.id);

    return mapEntityToModel(entity);
}


