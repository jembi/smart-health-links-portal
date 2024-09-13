import { BaseEntity } from './base-entity';

export class UserEntity extends BaseEntity {
  user_id: string;
  patient_id: string;
}
