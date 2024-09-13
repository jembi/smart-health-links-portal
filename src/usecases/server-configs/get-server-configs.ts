import { ServerConfigModel } from '@/domain/models/server-config';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { mapEntityToModel } from '@/mappers/server-config-mapper';

export const getServerConfigsUseCase = async (context: {
  repo: IServerConfigRepository;
}): Promise<ServerConfigModel[]> => {
  const results = await context.repo.findMany({});
  return results.map((result) => mapEntityToModel(result));
};
