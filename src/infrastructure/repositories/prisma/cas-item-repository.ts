import { CasItemEntity } from "@/entities/cas-item";
import { BasePrismaRepository } from "./base-repository";
import { PrismaClient } from "@prisma/client";

export class CasItemPrismaRepository extends BasePrismaRepository<CasItemEntity> {
    constructor(prismaClient: PrismaClient){
        super(prismaClient, 'cas_item');
    }
}