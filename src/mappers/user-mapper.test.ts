import { UserDto } from "@/domain/dtos/user";
import { UserEntity } from "@/entities/user";
import { mapEntityToModel, mapModelToEntity, mapModelToDto, mapDtoToModel } from "./user-mapper";
import { UserModel } from "@/domain/models/user";

describe("User Mappers", () => {
  const userEntity: UserEntity = {
    id: "entity-id",
    user_id: "entity-user-id",
    patient_id: "entity-patient-id",
  };

  const userModel = new UserModel("model-user-id", "model-patient-id", "model-id");

  const userDto: UserDto = {
    id: "dto-id",
    userId: "dto-user-id",
    patientId: "dto-patient-id",
  };

  describe("mapEntityToModel", () => {
    it("should map a UserEntity to a UserModel", () => {
      const result = mapEntityToModel(userEntity);
      expect(result).toBeInstanceOf(UserModel);
      expect(result?.getId()).toBe(userEntity.id);
      expect(result?.getUserId()).toBe(userEntity.user_id);
      expect(result?.getPatientId()).toBe(userEntity.patient_id);
    });

    it("should return undefined if UserEntity is undefined", () => {
      const result = mapEntityToModel(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("mapModelToEntity", () => {
    it("should map a UserModel to a UserEntity", () => {
      const result = mapModelToEntity(userModel);
      expect(result).toEqual({
        id: userModel.getId(),
        user_id: userModel.getUserId(),
        patient_id: userModel.getPatientId(),
      });
    });

    it("should return undefined if UserModel is undefined", () => {
      const result = mapModelToEntity(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("mapModelToDto", () => {
    it("should map a UserModel to a UserDto", () => {
      const result = mapModelToDto(userModel);
      expect(result).toEqual({
        id: userModel.getId(),
        userId: userModel.getUserId(),
        patientId: userModel.getPatientId(),
      });
    });

    it("should return undefined if UserModel is undefined", () => {
      const result = mapModelToDto(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("mapDtoToModel", () => {
    it("should map a UserDto to a UserModel", () => {
      const result = mapDtoToModel(userDto);
      expect(result).toBeInstanceOf(UserModel);
      expect(result?.getId()).toBe(userDto.id);
      expect(result?.getUserId()).toBe(userDto.userId);
      expect(result?.getPatientId()).toBe(userDto.patientId);
    });

    it("should return undefined if UserDto is undefined", () => {
      const result = mapDtoToModel(undefined);
      expect(result).toBeUndefined();
    });
  });
});
