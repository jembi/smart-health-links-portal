import { SHLinkAccessDto } from '@/domain/dtos/shlink-access';
import { SHLinkAccessModel } from '@/domain/models/shlink-access';
import { SHLinkAccessEntity } from '@/entities/shlink-access';

import {
  mapModelToEntity,
  mapEntityToModel,
  mapModelToDto,
} from './shlink-access-mapper';

// Mock the SHLinkAccessModel class
jest.mock('@/domain/models/shlink-access', () => {
  return {
    SHLinkAccessModel: jest
      .fn()
      .mockImplementation(
        (shlinkId: string, accessTime: Date, recipient: string, id: string) => {
          return {
            getAccessTime: jest.fn(() => accessTime),
            getRecipient: jest.fn(() => recipient),
            getSHLinkId: jest.fn(() => shlinkId),
            getId: jest.fn(() => id),
          };
        },
      ),
  };
});

const dateValue = new Date('2024-01-01T00:00:00Z')

describe('mapModelToEntity', () => {
  it('should map a SHLinkAccessModel to SHLinkAccessEntity', () => {
    const accessTime = new Date('2024-09-01T12:00:00Z');
    const recipient = 'test@example.com';
    const shlinkId = 'abc123';
    const id = 'def456';

    const model = new SHLinkAccessModel(shlinkId, accessTime, recipient, id);

    const expectedEntity: SHLinkAccessEntity = {
      access_time: accessTime,
      recipient: recipient,
      shlink_id: shlinkId,
      id: id
    };

    const result = mapModelToEntity(model);

    expect(result).toEqual(expectedEntity);
  });

  it('should return undefined if SHLinkAccessModel is undefined', () => {
    const result = mapModelToEntity(undefined);

    expect(result).toBeUndefined();
  });

  it('should return undefined if SHLinkAccessModel is null', () => {
    const result = mapModelToEntity(null as any);

    expect(result).toBeUndefined();
  });
});

describe('mapEntityToModel', () => {
  it('should map a SHLinkAccessEntity to SHLinkAccessModel', () => {
    const accessTime = new Date('2024-09-01T12:00:00Z');
    const recipient = 'test@example.com';
    const shlinkId = 'abc123';
    const id = 'def456';

    const entity: SHLinkAccessEntity = {
      access_time: accessTime,
      recipient: recipient,
      shlink_id: shlinkId,
      id: id
    };

    const expectedModel = new SHLinkAccessModel(
      shlinkId,
      accessTime,
      recipient,
      id
    );

    const result = mapEntityToModel(entity);

    expect(result.getId()).toEqual(expectedModel.getId());
    expect(result.getAccessTime()).toEqual(expectedModel.getAccessTime());
    expect(result.getRecipient()).toEqual(expectedModel.getRecipient());
    expect(result.getSHLinkId()).toEqual(expectedModel.getSHLinkId());
  });

  it('should return undefined if SHLinkAccessEntity is undefined', () => {
    const result = mapEntityToModel(undefined);

    expect(result).toBeUndefined();
  });

  it('should return undefined if SHLinkAccessEntity is null', () => {
    const result = mapEntityToModel(null as any);

    expect(result).toBeUndefined();
  });
});

describe('mapModelToDto', () => {
  it('should map a SHLinkAccessModel to SHLinkAccessDto', () => {
    const accessTime = new Date('2024-09-01T12:00:00Z');
    const recipient = 'test@example.com';
    const shlinkId = 'abc123';
    const id = 'def456';

    const model = new SHLinkAccessModel(shlinkId, accessTime, recipient, id);

    const expectedDto: SHLinkAccessDto = {
      accessTime: accessTime,
      recipient: recipient,
      shlinkId: shlinkId,
      id: id
    };

    const result = mapModelToDto(model);

    expect(result).toEqual(expectedDto);
  });

  it('should return undefined if SHLinkAccessModel is undefined', () => {
    const result = mapModelToDto(undefined);

    expect(result).toBeUndefined();
  });

  it('should return undefined if SHLinkAccessModel is null', () => {
    const result = mapModelToDto(null as any);

    expect(result).toBeUndefined();
  });
});
