import { SHLinkEndpointEntity } from '@/entities/shlink-endpoint';
import { IRepository } from './repository.interface';

export interface ISHLinkEndpointRepository
  extends IRepository<SHLinkEndpointEntity> {}
