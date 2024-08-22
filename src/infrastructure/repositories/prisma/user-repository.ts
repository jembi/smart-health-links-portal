import { UserEntity } from "@/entities/user";
import { BasePrismaRepository } from "./base-repository";
import { PrismaClient } from "@prisma/client";

export class IUserRepository extends BasePrismaRepository<UserEntity>{
    constructor(prismaClient: PrismaClient){
        super(prismaClient, 'user');
    }
};