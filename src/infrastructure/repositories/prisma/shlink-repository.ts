import { SHLinkEntity } from "@/entities/shlink";
import { BasePrismaRepository } from "./base-repository";
import { PrismaClient } from "@prisma/client";

export class SHLinkPrismaRepository extends BasePrismaRepository<SHLinkEntity>{
    constructor(prismsClient: PrismaClient){
        super(prismsClient, 'shlink');
    }
}