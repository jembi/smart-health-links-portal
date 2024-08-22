import { UserEntity } from "@/entities/user";
import { IRepository } from "./repository.interface";

export interface IUserRepository extends IRepository<UserEntity>{};