
export class CreateSHLinkDto {
    userId: string
    passcodeFailuresRemaining: number
    configPasscode?: string
    configExp?: Date
    active: boolean
    managementToken: string
}

export class SHLinkDto extends CreateSHLinkDto{
    id: string
}