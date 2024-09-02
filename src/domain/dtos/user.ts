export class CreateUserDto {
    userId: string
    patientId: string
}

export class UserDto extends CreateUserDto{
    id: string
}