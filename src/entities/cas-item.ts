import { BaseEntity } from "./base-entity";

export class CasItemEntity extends BaseEntity{
  hash: string;
  content: string;
  ref_count: number;
}