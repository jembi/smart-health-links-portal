import { SHLinkAccessEntity } from "@/entities/shlink-access";
import { BasePrismaRepository } from "./base-repository";
import { PrismaClient } from "@prisma/client";

export class SHLinkAccessPrismaRepository extends BasePrismaRepository<SHLinkAccessEntity>{
    constructor(prismaClient: PrismaClient){
        super(prismaClient, 'shlink_access');
    }
};