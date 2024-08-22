import { UserDto } from "@/domain/dtos/user";
import { UserModel } from "@/domain/models/user";
import { UserEntity } from "@/entities/user";

export const mapEntityToModel = (userEntity: UserEntity): UserModel => {
    return new UserModel(
        userEntity.user_id, 
        userEntity.patient_id, 
        userEntity.id
    );
}

const mapModelToEntity = (userModel: UserModel): UserEntity => {
    return {
        id: userModel.getId(),
        user_id: userModel.getUserId(),
        patient_id: userModel.getPatientId()
    };
}

export const mapModelToDto = (userModel: UserModel): UserDto => {
    return {
        id: userModel.getId(),
        patientId: userModel.getId(),
        userId: userModel.getId()
    };
}

export const mapDtoToModel = (userDto: UserDto): UserModel => {
    return new UserModel(
        userDto.userId, userDto.patientId, userDto.id
    );
}