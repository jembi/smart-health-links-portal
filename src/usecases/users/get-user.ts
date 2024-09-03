import { UserModel } from '@/domain/models/user';
import { IUserRepository } from '@/infrastructure/repositories/interfaces/user-repository';
import { mapEntityToModel } from '@/mappers/user-mapper';

export const getUserUseCase = async (
  context: { repo: IUserRepository },
  data: { userId: string },
): Promise<UserModel> => {
  const entity = await context.repo.findOne({ user_id: data.userId });

  return mapEntityToModel(entity);
};
