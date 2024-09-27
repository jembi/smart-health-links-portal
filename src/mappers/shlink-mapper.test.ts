import { EXTERNAL_URL } from '@/app/constants/http-constants';
import { SHLinkDto, SHLinkMiniDto } from '@/domain/dtos/shlink';
import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkEndpointModel } from '@/domain/models/shlink-endpoint';
import { SHLinkEntity } from '@/entities/shlink';
import {
  mapEntityToModel,
  mapModelToEntity,
  mapModelToDto,
  mapDtoToModel,
  mapModelToMiniDto,
} from '@/mappers/shlink-mapper';

const dateValue = new Date('2024-01-01T00:00:00Z')

describe('SHLink Mappers', () => {
  const shLinkEntity: SHLinkEntity = {
    id: '1',
    name: 'name',
    user_id: '1234567890',
    passcode_failures_remaining: 3,
    active: true,
    management_token: 'tokenxyz123',
    config_passcode: 'passcodeabc',
    config_exp: dateValue,
    created_at: dateValue,
    updated_at: dateValue
  };

  const shLinkModel = new SHLinkModel(
    '1234567890',
    'name',
    3,
    true,
    'tokenxyz123',
    'passcodeabc',
    dateValue,
    '1',
    dateValue,
    dateValue
  );

  const shLinkDto: SHLinkDto = {
    id: '1',
    name: 'name',
    userId: '1234567890',
    passcodeFailuresRemaining: 3,
    active: true,
    managementToken: 'tokenxyz123',
    configPasscode: 'passcodeabc',
    configExp:dateValue,
    createdAt:dateValue,
    updatedAt:dateValue
  };

  describe('mapEntityToModel', () => {
    it('should map a SHLinkEntity to a SHLinkModel', () => {
      const result = mapEntityToModel(shLinkEntity);
      expect(result).toBeInstanceOf(SHLinkModel);
      expect(result?.getId()).toBe(shLinkEntity.id);
      expect(result?.getUserId()).toBe(shLinkEntity.user_id);
      expect(result?.getPasscodeFailuresRemaining()).toBe(
        shLinkEntity.passcode_failures_remaining,
      );
      expect(result?.getActive()).toBe(shLinkEntity.active);
      expect(result?.getManagementToken()).toBe(shLinkEntity.management_token);
      expect(result?.getConfigPasscode()).toBe(shLinkEntity.config_passcode);
      expect(result?.getConfigExp()).toBe(shLinkEntity.config_exp);
    });

    it('should return undefined if SHLinkEntity is undefined', () => {
      const result = mapEntityToModel(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('mapModelToEntity', () => {
    it('should map a SHLinkModel to a SHLinkEntity', () => {
      const result = mapModelToEntity(shLinkModel);
      expect(result).toEqual({
        id: shLinkModel.getId(),
        name: shLinkModel.getName(),
        user_id: shLinkModel.getUserId(),
        passcode_failures_remaining: shLinkModel.getPasscodeFailuresRemaining(),
        active: shLinkModel.getActive(),
        management_token: shLinkModel.getManagementToken(),
        config_passcode: shLinkModel.getConfigPasscode(),
        config_exp: shLinkModel.getConfigExp(),
        created_at: shLinkModel.getCreatedAt(),
        updated_at: shLinkModel.getUpdatedAt()
      });
    });

    it('should return undefined if SHLinkModel is undefined', () => {
      const result = mapModelToEntity(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('mapModelToDto', () => {
    it('should map a SHLinkModel to a SHLinkDto', () => {
      const result = mapModelToDto(shLinkModel);
      expect(result).toEqual({
        id: shLinkModel.getId(),
        name: shLinkModel.getName(),
        userId: shLinkModel.getUserId(),
        passcodeFailuresRemaining: shLinkModel.getPasscodeFailuresRemaining(),
        active: shLinkModel.getActive(),
        managementToken: shLinkModel.getManagementToken(),
        configPasscode: shLinkModel.getConfigPasscode(),
        configExp: shLinkModel.getConfigExp(),
        createdAt: shLinkModel.getCreatedAt(),
        updatedAt: shLinkModel.getUpdatedAt()

      });
    });

    it('should return undefined if SHLinkModel is undefined', () => {
      const result = mapModelToDto(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('mapDtoToModel', () => {
    it('should map a SHLinkDto to a SHLinkModel', () => {
      const result = mapDtoToModel(shLinkDto);
      expect(result).toBeInstanceOf(SHLinkModel);
      expect(result?.getId()).toBe(shLinkDto.id);
      expect(result?.getUserId()).toBe(shLinkDto.userId);
      expect(result?.getPasscodeFailuresRemaining()).toBe(
        shLinkDto.passcodeFailuresRemaining,
      );
      expect(result?.getActive()).toBe(shLinkDto.active);
      expect(result?.getManagementToken()).toBe(shLinkDto.managementToken);
      expect(result?.getConfigPasscode()).toBe(shLinkDto.configPasscode);
      expect(result?.getConfigExp()).toEqual(shLinkDto.configExp);
    });

    it('should return undefined if SHLinkDto is undefined', () => {
      const result = mapDtoToModel(undefined);
      expect(result).toBeUndefined();
    });
  });
});

describe('mapModelToMiniDto', () => {
  it('should return correct SHLinkMiniDto when provided valid SHLinkModel and files', () => {
    // Create a valid SHLinkModel instance
    const date = new Date(Date.now() + 10000); // future date;
    const shlinkModel = new SHLinkModel(
      'unique-user-id',
      'name',
      5,
      true,
      'management-token',
      'config-passcode',
      date,
      'link-id',
     dateValue,
     dateValue
    );

    // Create valid SHLinkEndpointModel instances
    const endpoint1 = new SHLinkEndpointModel(
      'shlink-id-1',
      'server-config-id-1',
      'url-path-1',
      'endpoint1-id',
     dateValue,
     dateValue,
    );
    const endpoint2 = new SHLinkEndpointModel(
      'shlink-id-2',
      'server-config-id-2',
      'url-path-2',
      'endpoint2-id',
     dateValue,
     dateValue,
    );
    const files = [endpoint1, endpoint2];
    const ticket = 'sample-ticket';

    // Execute the function
    const result = mapModelToMiniDto(shlinkModel, files, ticket);

    // Assert the expected result
    expect(result).toEqual({
      id: 'link-id',
      managementToken: 'management-token',
      expiryDate: date,
      passwordRequired: true,
      url: 'http://localhost:3000/viewer#shlink:/eyJsYWJlbCI6Im5hbWUiLCJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3YxL3NoYXJlLWxpbmtzL2xpbmstaWQiLCJmbGFnIjoiUCJ9',
      name: 'name',
      active: true,
      createdAt: dateValue,
      updatedAt: dateValue,
      files: [
        {
          location: `${EXTERNAL_URL}/api/v1/share-links/link-id/endpoints/endpoint1-id?ticket=${ticket}`,
          contentType: 'application/smart-api-access',
          embedded: null,
        },
        {
          location: `${EXTERNAL_URL}/api/v1/share-links/link-id/endpoints/endpoint2-id?ticket=${ticket}`,
          contentType: 'application/smart-api-access',
          embedded: null,
        },
      ],
    });
  });

  it('should return correct SHLinkMiniDto with no files', () => {
    // Create a valid SHLinkModel instance
    const date = new Date(Date.now() + 10000); // future date;
    const shlinkModel = new SHLinkModel(
      'unique-user-id',
      'name',
      5,
      true,
      'management-token',
      'config-passcode',
      date,
      'link-id',
     dateValue,
     dateValue
    );

    // Execute the function
    const result = mapModelToMiniDto(shlinkModel);

    // Assert the expected result
    expect(result).toEqual({
      id: 'link-id',
      managementToken: 'management-token',
      passwordRequired: true,
      name: 'name',
      expiryDate: date,
      active: true,
      files: undefined,
      createdAt: dateValue,
      updatedAt: dateValue,
      url: 'http://localhost:3000/viewer#shlink:/eyJsYWJlbCI6Im5hbWUiLCJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3YxL3NoYXJlLWxpbmtzL2xpbmstaWQiLCJmbGFnIjoiUCJ9',
    });
  });

  it('should return undefined if no SHLinkModel is provided', () => {
    // Execute the function with undefined SHLinkModel
    const result = mapModelToMiniDto(undefined as unknown as SHLinkModel);

    // Assert the result is undefined
    expect(result).toBeUndefined();
  });

  it('should return correct SHLinkMiniDto when ticket is not provided', () => {
    // Create a valid SHLinkModel instance
    const date = new Date(Date.now() + 10000); // future date;
    const shlinkModel = new SHLinkModel(
      'unique-user-id',
      'name',
      5,
      true,
      'management-token',
      'config-passcode',
      date,
      'link-id',
     dateValue,
     dateValue
    );

    // Create a valid SHLinkEndpointModel instance
    const endpoint = new SHLinkEndpointModel(
      'shlink-id',
      'server-config-id',
      'url-path',
      'endpoint-id',
     dateValue,
     dateValue,
    );
    const files = [endpoint];

    // Execute the function without a ticket
    const result = mapModelToMiniDto(shlinkModel, files);

    // Assert the expected result
    expect(result).toEqual({
      id: 'link-id',
      managementToken: 'management-token',
      passwordRequired: true,
      name: 'name',
      url: 'http://localhost:3000/viewer#shlink:/eyJsYWJlbCI6Im5hbWUiLCJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3YxL3NoYXJlLWxpbmtzL2xpbmstaWQiLCJmbGFnIjoiUCJ9',
      expiryDate: date,
      active: true,
      createdAt: dateValue,
      updatedAt: dateValue,
      files: [
        {
          location: `${EXTERNAL_URL}/api/v1/share-links/link-id/endpoints/endpoint-id?ticket=undefined`,
          contentType: 'application/smart-api-access',
          embedded: null,
        },
      ],
    });
  });
});
