import { SHLinkAccessEntity } from "@/entities/shlink-access";
import { BasePrismaRepository } from "./base-repository";
import { PrismaClient } from "@prisma/client";
import { ISHLinkAccessRepository } from "../interfaces/shlink-access-repository";

export class SHLinkAccessPrismaRepository extends BasePrismaRepository<SHLinkAccessEntity> implements ISHLinkAccessRepository{
    constructor(prismaClient: PrismaClient){
        super(prismaClient, 'shlink_access');
    }
};