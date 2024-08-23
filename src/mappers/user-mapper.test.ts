import { UserDto } from "@/domain/dtos/user";
import { UserModel } from "@/domain/models/user";
import { UserEntity } from "@/entities/user";
import { mapEntityToModel, mapModelToEntity, mapModelToDto, mapDtoToModel } from "./user-mapper";

describe('Mapping Functions', () => {
  describe('mapEntityToModel', () => {
    it('should map UserEntity to UserModel correctly', () => {
      const userEntity: UserEntity = {
        user_id: 'user123',
        patient_id: 'patient456',
        id: 'entity789'
      };
      
      const userModel = mapEntityToModel(userEntity);
      
      expect(userModel).toBeDefined();
      expect(userModel).toBeInstanceOf(UserModel);
      expect(userModel?.getUserId()).toBe(userEntity.user_id);
      expect(userModel?.getPatientId()).toBe(userEntity.patient_id);
      expect(userModel?.getId()).toBe(userEntity.id);
    });

    it('should return undefined if userEntity is undefined', () => {
      expect(mapEntityToModel(undefined)).toBeUndefined();
    });
  });

  describe('mapModelToEntity', () => {
    it('should map UserModel to UserEntity correctly', () => {
      const userModel = new UserModel('user123', 'patient456', 'model789');
      
      const userEntity = mapModelToEntity(userModel);
      
      expect(userEntity).toBeDefined();
      expect(userEntity).toEqual({
        id: userModel.getId(),
        user_id: userModel.getUserId(),
        patient_id: userModel.getPatientId()
      });
    });

    it('should return undefined if userModel is undefined', () => {
      expect(mapModelToEntity(undefined)).toBeUndefined();
    });
  });

  describe('mapModelToDto', () => {
    it('should map UserModel to UserDto correctly', () => {
      const userModel = new UserModel('user123', 'patient456', 'model789');
      
      const userDto = mapModelToDto(userModel);
      
      expect(userDto).toBeDefined();
      expect(userDto).toEqual({
        id: userModel.getId(),
        patientId: userModel.getPatientId(),
        userId: userModel.getUserId()
      });
    });

    it('should return undefined if userModel is undefined', () => {
      expect(mapModelToDto(undefined)).toBeUndefined();
    });
  });

  describe('mapDtoToModel', () => {
    it('should map UserDto to UserModel correctly', () => {
      const userDto: UserDto = {
        userId: 'user123',
        patientId: 'patient456',
        id: 'dto789'
      };
      
      const userModel = mapDtoToModel(userDto);
      
      expect(userModel).toBeDefined();
      expect(userModel).toBeInstanceOf(UserModel);
      expect(userModel?.getUserId()).toBe(userDto.userId);
      expect(userModel?.getPatientId()).toBe(userDto.patientId);
      expect(userModel?.getId()).toBe(userDto.id);
    });

    it('should return undefined if userDto is undefined', () => {
      expect(mapDtoToModel(undefined)).toBeUndefined();
    });
  });

});
