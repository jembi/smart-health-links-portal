
export class CreateSHLinkEndpointDto {
    shlinkId?: string
    serverConfigId?: string
    urlPath: string
    managementToken?: string
}

export class SHLinkEndpointDto extends CreateSHLinkEndpointDto{
    id: string
}