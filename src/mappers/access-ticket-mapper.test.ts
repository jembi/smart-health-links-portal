import { AccessTicketModel } from '@/domain/models/access-ticket';
import { AccessTicketEntity } from '@/entities/access-ticket';

import { mapEntityToModel, mapModelToEntity } from './access-ticket-mapper';

const dateValue = new Date('2024-01-01T00:00:00Z')

describe('Mapping functions', () => {
  describe('mapEntityToModel', () => {
    it('should map a valid AccessTicketEntity to AccessTicketModel', () => {
      const entity: AccessTicketEntity = {
        id: '123',
        shlink_id: 'abc',
        created_at:dateValue,
        updated_at:dateValue
      };

      const model = mapEntityToModel(entity);

      expect(model).toBeInstanceOf(AccessTicketModel);
      expect(model?.getId()).toBe('123');
      expect(model?.getSHLinkId()).toBe('abc');
    });

    it('should return undefined if AccessTicketEntity is undefined', () => {
      const model = mapEntityToModel(undefined);

      expect(model).toBeUndefined();
    });

    it('should return undefined if AccessTicketEntity is null', () => {
      const model = mapEntityToModel(null as any);

      expect(model).toBeUndefined();
    });
  });

  describe('mapModelToEntity', () => {
    it('should map a valid AccessTicketModel to AccessTicketEntity', () => {
      const model = new AccessTicketModel('abc', '123');

      const entity = mapModelToEntity(model);

      expect(entity).toEqual({
        id: '123',
        shlink_id: 'abc'
      });
    });

    it('should return undefined if AccessTicketModel is undefined', () => {
      const entity = mapModelToEntity(undefined);

      expect(entity).toBeUndefined();
    });

    it('should return undefined if AccessTicketModel is null', () => {
      const entity = mapModelToEntity(null as any);

      expect(entity).toBeUndefined();
    });
  });
});
