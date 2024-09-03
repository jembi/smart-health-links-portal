import { addUserUseCase } from './add-user';
import { UserModel } from '@/domain/models/user';
import { UserEntity } from '@/entities/user';
import { IUserRepository } from '@/infrastructure/repositories/interfaces/user-repository';
import { mapEntityToModel, mapModelToEntity } from '@/mappers/user-mapper';

jest.mock('@/mappers/user-mapper', () => ({
  mapEntityToModel: jest.fn(),
  mapModelToEntity: jest.fn(),
}));

describe('addUserUseCase', () => {
  let mockRepo: jest.Mocked<IUserRepository>;
  let mockUserModel: UserModel;
  let mockUserEntity: UserEntity;

  beforeEach(() => {
    mockRepo = {
      findOne: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
    } as any;

    mockUserModel = {
      getUserId: jest.fn().mockReturnValue('test-id'),
      // Add other methods if necessary
    } as any;

    mockUserEntity = {
      id: 'test-id',
      // Add other properties if necessary
    } as any;

    (mapModelToEntity as jest.Mock).mockReturnValue(mockUserEntity);
    (mapEntityToModel as jest.Mock).mockReturnValue(mockUserModel);
  });

  it('should insert a new user if user does not exist', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.insert.mockResolvedValue(mockUserEntity);

    const result = await addUserUseCase(
      { repo: mockRepo },
      { user: mockUserModel },
    );

    expect(mockRepo.findOne).toHaveBeenCalledWith({ user_id: 'test-id' });
    expect(mockRepo.insert).toHaveBeenCalledWith({
      ...mockUserEntity,
      id: undefined,
    });
    expect(result).toBe(mockUserModel);
  });

  it('should update an existing user if user exists', async () => {
    mockRepo.findOne.mockResolvedValue(mockUserEntity);
    mockRepo.update.mockResolvedValue(mockUserEntity);

    const result = await addUserUseCase(
      { repo: mockRepo },
      { user: mockUserModel },
    );

    expect(mockRepo.findOne).toHaveBeenCalledWith({ user_id: 'test-id' });
    expect(mockRepo.update).toHaveBeenCalledWith({
      ...mockUserEntity,
      id: undefined,
    });
    expect(result).toBe(mockUserModel);
  });

  it('should return the mapped result from mapEntityToModel', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.insert.mockResolvedValue(mockUserEntity);

    const result = await addUserUseCase(
      { repo: mockRepo },
      { user: mockUserModel },
    );

    expect(mapEntityToModel).toHaveBeenCalledWith(mockUserEntity);
    expect(result).toBe(mockUserModel);
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Test error');
    mockRepo.findOne.mockRejectedValue(error);

    await expect(
      addUserUseCase({ repo: mockRepo }, { user: mockUserModel }),
    ).rejects.toThrow(error);

    expect(mockRepo.findOne).toHaveBeenCalledWith({ user_id: 'test-id' });
  });
});
