import { UserModel } from "@/domain/models/user"
import { UserPrismaRepository } from "@/infrastructure/repositories/prisma/user-repository"
import { mapEntityToModel } from "@/mappers/user-mapper";

export const getUserUseCase = async (context: {repo: UserPrismaRepository}, data: {id: string}): Promise<UserModel> => {
    const entity = await context.repo.findById(data.id);
    console.log(entity);
    return mapEntityToModel(entity);
}


