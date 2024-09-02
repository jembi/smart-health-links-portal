export class CreateServerConfigDto {
  configKey?: string;
  refreshToken?: string;
  refreshTime?: Date;
  tokenEndpoint?: string;
  endpointUrl: string;
  clientSecret?: string;
  clientId?: string;
  accessTokenResponse?: string;
}

export class ServerConfigDto extends CreateServerConfigDto {
  id: string;
}
