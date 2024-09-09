import { ServerConfigEntity } from '@/entities/server_config';

import { IRepository } from './repository.interface';

export interface IServerConfigRepository
  extends IRepository<ServerConfigEntity> {}
