import { SHLinkEndpointEntity } from "@/entities/shlink-endpoint";
import { BasePrismaRepository } from "./base-repository";
import { PrismaClient } from "@prisma/client";

export class SHLinkEndpointPrismaRepository extends BasePrismaRepository<SHLinkEndpointEntity>{
    constructor(prismaClient: PrismaClient){
        super(prismaClient, 'shlink_endpoint');
    }
};