import { SHLinkEndpointModel } from "@/domain/models/shlink-endpoint";
import { ISHLinkEndpointRepository } from "@/infrastructure/repositories/interfaces/shlink-endpoint-repository";
import { mapEntityToModel, mapModelToEntity } from "@/mappers/shlink-endpoint-mapper";

export const getEndpointUseCase = async (
  context: { repo: ISHLinkEndpointRepository },
  data: { id: string },
): Promise<SHLinkEndpointModel> => {
  const entity = await context.repo.findOne({ id: data.id });

  return mapEntityToModel(entity);
};
