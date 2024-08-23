import { SHLinkEntity } from "@/entities/shlink";
import { BasePrismaRepository } from "./base-repository";
import { PrismaClient } from "@prisma/client";
import { ISHLinkRepository } from "../interfaces/shlink-repository";

export class SHLinkPrismaRepository extends BasePrismaRepository<SHLinkEntity> implements ISHLinkRepository{
    constructor(prismsClient: PrismaClient){
        super(prismsClient, 'shlink');
    }
}