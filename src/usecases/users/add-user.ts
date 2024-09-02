import { UserModel } from "@/domain/models/user";
import { UserEntity } from "@/entities/user";
import { IUserRepository } from "@/infrastructure/repositories/interfaces/user-repository";
import { mapEntityToModel, mapModelToEntity } from "@/mappers/user-mapper";

export const addUserUseCase = async (context: {repo: IUserRepository}, data: {user: UserModel}): Promise<UserModel> => {
    const oldUser = await context.repo.findOne({user_id: data.user.getUserId()});
    let newUser: UserEntity;
    
    let entity = mapModelToEntity(data.user);
    entity.id = undefined;

    if(!oldUser){
        newUser = await context.repo.insert(entity);
    }  
    else{
      entity.id = oldUser.id;
      newUser = await context.repo.update(entity);
    }        

    return mapEntityToModel(newUser);
}