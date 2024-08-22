import { BaseEntity } from "./base-entity";

export class SHLinkFileEntity extends BaseEntity{
    shlink_id: string
    content_type: string
    content_hash: string
}