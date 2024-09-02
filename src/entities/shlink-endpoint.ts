import { BaseEntity } from './base-entity';

export class SHLinkEndpointEntity extends BaseEntity {
  shlink_id: string;
  server_config_id: string;
  url_path: string;
}
