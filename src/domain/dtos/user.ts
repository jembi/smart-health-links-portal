export class CreateUSerDto {
    userId: string
    patientId: string
}

export class UserDto extends CreateUSerDto{
    id: string
}