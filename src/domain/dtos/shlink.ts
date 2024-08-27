
export class CreateShlinkDto {
    userId: string
    passcodeFailuresRemaining: number
    configPasscode?: string
    configExp?: Date
    active: boolean
    managementToken: string
}

export class ShlinkDto extends CreateShlinkDto{
    id: string
}