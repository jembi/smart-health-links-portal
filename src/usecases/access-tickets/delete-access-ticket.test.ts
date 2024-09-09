/**
 * @jest-environment node
 */
import { AccessTicketModel } from "@/domain/models/access-ticket";
import { IAccessTicketRepository } from "@/infrastructure/repositories/interfaces/access-ticket-repository.interface";
import { mapEntityToModel } from "@/mappers/access-ticket-mapper";
import { deleteAccessTicketUseCase } from "@/usecases/access-tickets/delete-access-ticket";

// Mock dependencies
jest.mock("@/mappers/access-ticket-mapper", () => ({
  mapEntityToModel: jest.fn(),
}));

describe('deleteAccessTicketUseCase', () => {
  // Define the repository mock
  const mockRepo: jest.Mocked<IAccessTicketRepository> = {
    findById: jest.fn(),
    delete: jest.fn(),
    insert: jest.fn(),
    insertMany: jest.fn(),
    findMany: jest.fn(),
    findOne:  jest.fn(),
    update: jest.fn(),
  };

  const mockMapEntityToModel = mapEntityToModel as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined if the access ticket is not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    const result = await deleteAccessTicketUseCase({ repo: mockRepo }, { id: '123' });

    expect(mockRepo.findById).toHaveBeenCalledWith('123');
    expect(mockRepo.delete).not.toHaveBeenCalled();
    expect(mockMapEntityToModel).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should delete the access ticket and return the mapped model if found', async () => {
    const entity = { id: '123', shlink_id: '123'}; // Mock entity
    const model = new AccessTicketModel('123'); // Mock model

    mockRepo.findById.mockResolvedValue(entity);
    mockMapEntityToModel.mockReturnValue(model);

    const result = await deleteAccessTicketUseCase({ repo: mockRepo }, { id: '123' });

    expect(mockRepo.findById).toHaveBeenCalledWith('123');
    expect(mockRepo.delete).toHaveBeenCalledWith(entity);
    expect(mockMapEntityToModel).toHaveBeenCalledWith(entity);
    expect(result).toEqual(model);
  });
});
