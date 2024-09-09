import { AccessTicketModel } from '@/domain/models/access-ticket';
import { IAccessTicketRepository } from '@/infrastructure/repositories/interfaces/access-ticket-repository.interface';
import { mapEntityToModel } from '@/mappers/access-ticket-mapper';

import { getAccessTicketUseCase } from './get-access-ticket';

// Mock the dependencies
jest.mock('@/mappers/access-ticket-mapper', () => ({
  mapEntityToModel: jest.fn(),
}));

describe('getAccessTicketUseCase', () => {
  let mockRepo: jest.Mocked<IAccessTicketRepository>;

  const mockEntity = {
    id: 'ticket-123',
    shlink_id: 'abc',
  };

  const mockModel = new AccessTicketModel('abc', '123');

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IAccessTicketRepository>;
    jest.clearAllMocks();
  });

  it('should retrieve the entity by ID and map it to a model', async () => {
    mockRepo.findById.mockResolvedValue(mockEntity);
    (mapEntityToModel as jest.Mock).mockReturnValue(mockModel);

    const result = await getAccessTicketUseCase(
      { repo: mockRepo },
      'ticket-123',
    );

    expect(mockRepo.findById).toHaveBeenCalledWith('ticket-123');
    expect(mapEntityToModel).toHaveBeenCalledWith(mockEntity);
    expect(result).toEqual(mockModel);
  });
});
