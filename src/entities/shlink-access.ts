import { BaseEntity } from './base-entity';

export class SHLinkAccessEntity extends BaseEntity {
  shlink_id: string;
  recipient: string;
  access_time: Date;
}
