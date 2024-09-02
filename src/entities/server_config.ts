import { BaseEntity } from "./base-entity";

export class ServerConfigEntity extends BaseEntity{
    endpoint_url: string;
    config_key?: string;
    config_client_id?: string;
    config_client_secret?: string;
    config_token_endpoint?: string;
    config_refresh_token?: string;
    refresh_time?: Date;
    access_token_response?: string;
}