import { SHLinkModel } from '@/domain/models/shlink';
import { Filter, QueryFilter, LogicOperator } from '@/infrastructure/repositories/interfaces/repository.interface';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapEntityToModel } from '@/mappers/shlink-mapper';

export const getSHLinkUseCase = async (
  context: { repo: ISHLinkRepository },
  data: { user_id: string; status?: string },
): Promise<SHLinkModel[]> => {

  let logicOperator = {};

  const statusLogicMap = {
    inactive: { active: false },
    active: { active: true },
    expired: { config_exp: { lt: new Date() } },
  };

  logicOperator = statusLogicMap[data.status] || {}

  const entities = await context.repo.findMany({ 
    user_id:data.user_id,
    ...logicOperator
   });

  return entities.map((x) => mapEntityToModel(x));
};
