import { ServerConfigModel } from '@/domain/models/server-config';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import {
  mapEntityToModel,
  mapModelToEntity,
} from '@/mappers/server-config-mapper';

export const addServerConfigUseCase = async (
  context: { repo: IServerConfigRepository },
  data: { server: ServerConfigModel },
): Promise<ServerConfigModel> => {
  let entity = mapModelToEntity(data.server);
  const result = await context.repo.insert(entity);
  return mapEntityToModel(result);
};
