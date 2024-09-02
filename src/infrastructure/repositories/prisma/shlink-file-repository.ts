import { SHLinkFileEntity } from "@/entities/shlink-file";
import { BasePrismaRepository } from "./base-repository";
import { PrismaClient } from "@prisma/client";
import { ISHLinkFileRepository } from "../interfaces/shlink-file-repository";

export class SHLinkFilePrismaRepository extends BasePrismaRepository<SHLinkFileEntity> implements ISHLinkFileRepository{
    constructor(prismaClient: PrismaClient){
        super(prismaClient, 'shlink_file');
    }
};