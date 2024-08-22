import { UserModel } from "@/domain/models/user";
import { IUserRepository } from "@/infrastructure/repositories/interfaces/user-repository";
import { mapEntityToModel } from "@/mappers/user-mapper";

export const getUserUseCase = async (context: {repo: IUserRepository}, data: {id: string}): Promise<UserModel> => {
    const entity = await context.repo.findById(data.id);

    return mapEntityToModel(entity);
}


