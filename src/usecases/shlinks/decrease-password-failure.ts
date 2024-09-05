import { SHLinkModel } from "@/domain/models/shlink"
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository"
import { mapModelToEntity } from "@/mappers/shlink-mapper"

export const decreasePasswordFailureCountUseCase = async(context: { repo: ISHLinkRepository}, data: SHLinkModel): Promise<void> => {
    const entity = mapModelToEntity(data);

    entity.passcode_failures_remaining -= 1;
    context.repo.update(entity);
}
