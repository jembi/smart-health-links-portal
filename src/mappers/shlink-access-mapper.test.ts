import { SHLinkAccessModel } from "@/domain/models/shlink-access";
import { SHLinkAccessEntity } from "@/entities/shlink-access";
import { mapModelToEntity } from "./shlink-access-mapper";

// Mock the SHLinkAccessModel class
jest.mock("@/domain/models/shlink-access", () => {
  return {
    SHLinkAccessModel: jest.fn().mockImplementation((shlinkId: string, accessTime: Date, recipient: string, id: string) => {
      return {
        getAccessTime: jest.fn(() => accessTime),
        getRecipient: jest.fn(() => recipient),
        getSHLinkId: jest.fn(() => shlinkId),
        getId: jest.fn(() => id),
      };
    }),
  };
});

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
      id: id,
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
