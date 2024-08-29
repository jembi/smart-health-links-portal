
export class CreateSHLinkDto {
    userId: string
    configPasscode?: string
    configExp?: Date
}

export class SHLinkDto extends CreateSHLinkDto{
    id: string
    passcodeFailuresRemaining: number
    active: boolean
    managementToken: string
}