import { ServerConfigEntity } from "@/entities/server_config";
import { BasePrismaRepository } from "./base-repository";
import { PrismaClient } from "@prisma/client";

export class ServerConfigPrismaRepository extends BasePrismaRepository<ServerConfigEntity>{
    constructor(prismaClient: PrismaClient){
        super(prismaClient, 'server_config');
    }
};