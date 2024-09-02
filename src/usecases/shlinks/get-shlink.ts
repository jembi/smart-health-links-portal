
import { SHLinkEntity } from "@/entities/shlink";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";

export const getSHLinkUseCase = async (context: {repo: ISHLinkRepository}, data: {user_id: string}): Promise<SHLinkEntity[]> => {
    const entity = await context.repo.findMany({user_id: data.user_id})

    return entity;
}
