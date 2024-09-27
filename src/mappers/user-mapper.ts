import { UserDto } from '@/domain/dtos/user';
import { UserModel } from '@/domain/models/user';
import { UserEntity } from '@/entities/user';

export const mapEntityToModel = (
  userEntity: UserEntity,
): UserModel | undefined => {
  return userEntity
    ? new UserModel(
        userEntity.user_id,
        userEntity.patient_id,
        userEntity.id,
        userEntity.server_config_id,
        userEntity.created_at,
        userEntity.updated_at
      )
    : undefined;
};

export const mapModelToEntity = (
  userModel: UserModel,
): UserEntity | undefined => {
  return userModel
    ? {
        id: userModel.getId(),
        user_id: userModel.getUserId(),
        patient_id: userModel.getPatientId(),
        server_config_id: userModel.getServerConfigId()
      }
    : undefined;
};

export const mapModelToDto = (userModel: UserModel): UserDto | undefined => {
  return userModel
    ? {
        id: userModel.getId(),
        patientId: userModel.getPatientId(),
        userId: userModel.getUserId()
      }
    : undefined;
};

export const mapDtoToModel = (userDto: UserDto): UserModel | undefined => {
  return userDto
    ? new UserModel(
      userDto.userId,
      userDto.patientId,
      userDto.id,
      userDto.serverConfigId
    )
    : undefined;
};
