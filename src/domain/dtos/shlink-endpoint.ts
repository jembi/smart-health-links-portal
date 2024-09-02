
export class CreateSHLinkEndpointDto {
    shlinkId: string
    serverConfigId: string
    urlPath: string
}

export class SHLinkEndpointDto extends CreateSHLinkEndpointDto{
    id: string
}