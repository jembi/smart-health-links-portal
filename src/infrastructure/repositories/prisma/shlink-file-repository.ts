import { SHLinkFileEntity } from "@/entities/shlink-file";
import { BasePrismaRepository } from "./base-repository";
import { PrismaClient } from "@prisma/client";

export class ISHLinkFileRepository extends BasePrismaRepository<SHLinkFileEntity>{
    constructor(prismaClient: PrismaClient){
        super(prismaClient, 'shlink_file');
    }
};