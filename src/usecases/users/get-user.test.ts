import { getUserUseCase } from "./get-user";
import { UserModel } from "@/domain/models/user";
import { IUserRepository } from "@/infrastructure/repositories/interfaces/user-repository";
import { mapEntityToModel } from "@/mappers/user-mapper";

jest.mock('@/mappers/user-mapper', () => ({
  mapEntityToModel: jest.fn(),
}));

describe('getUserUseCase', () => {
  let mockRepo: jest.Mocked<IUserRepository>;
  let mockUserModel: UserModel;
  let mockUserEntity: any;

  beforeEach(() => {
    mockRepo = {
      findOne: jest.fn(),
    } as any;

    mockUserModel = {
      // Add properties or methods if necessary
    } as any;

    mockUserEntity = {
      // Add properties or methods if necessary
    } as any;

    (mapEntityToModel as jest.Mock).mockReturnValue(mockUserModel);
  });

  it('should retrieve and map a user successfully', async () => {
    mockRepo.findOne.mockResolvedValue(mockUserEntity);

    const result = await getUserUseCase({ repo: mockRepo }, { userId: 'test-id' });

    expect(mockRepo.findOne).toHaveBeenCalledWith({user_id: 'test-id'});
    expect(mapEntityToModel).toHaveBeenCalledWith(mockUserEntity);
    expect(result).toBe(mockUserModel);
  });

  it('should handle case where user is not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    const result = await getUserUseCase({ repo: mockRepo }, { userId: 'test-id' });

    expect(mockRepo.findOne).toHaveBeenCalledWith({user_id: 'test-id'});
    expect(mapEntityToModel).toHaveBeenCalledWith(null);
    expect(result).toBe(mockUserModel); // Ensure this is what your function should return for a null entity
  });

  it('should handle errors thrown by the repository', async () => {
    const error = new Error('Test error');
    mockRepo.findOne.mockRejectedValue(error);

    await expect(getUserUseCase({ repo: mockRepo }, { userId: 'test-id' }))
      .rejects
      .toThrow(error);

    expect(mockRepo.findOne).toHaveBeenCalledWith({user_id: 'test-id'});
  });
});
