export class SHLinkAccessRequestDto {
    managementToken: string
}

export class SHLinkAccessDto {
    shlinkId: string;
    accessTime: Date;
    recipient: string;
    id?: string;
}