import { BaseEntity } from "./base-entity";

export class SHLinkEntity extends BaseEntity {
  passcode_failures_remaining: number
  config_passcode: string
  config_exp: number
  management_token: string
  user_id: string
  active: boolean
}