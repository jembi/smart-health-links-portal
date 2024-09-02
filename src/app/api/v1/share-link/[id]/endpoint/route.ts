import { handleApiValidationError } from "@/app/utils/error-handler";
import { SHLinkEndpointDto } from "@/domain/dtos/shlink-endpoint";
import prisma from "@/infrastructure/clients/prisma";
import { SHLinkPrismaRepository } from "@/infrastructure/repositories/prisma/shlink-repository";
import {  mapModelToDto as mapModelToDtoShlinkMapper } from "@/mappers/shlink-mapper";
import { mapDtoToModel, mapModelToDto as mapModelToDtoEndpoint} from "@/mappers/shlink-endpoint-mapper"
import { NextResponse } from "next/server";
import { NOT_FOUND } from "@/app/constants/http-constants";
import { SHLinkEndpointPrismaRepository } from "@/infrastructure/repositories/prisma/shlink-endpoint-repository";
import { getSingleSHLinkUseCase } from "@/usecases/shlinks/get-single-shlink";
import { addEndpointUseCase } from "@/usecases/shlink-endpoint/add-endpoint";

const shlRepo = new SHLinkPrismaRepository(prisma);
const shlEndpointRepo = new SHLinkEndpointPrismaRepository(prisma);

  export async function POST(request: Request, { params }: { params: { id: string } }) {
    let dto = await request.json();
    try{
        const result = await getSingleSHLinkUseCase({repo:shlRepo}, {id: params.id});
        if(!result){
            return NextResponse.json({message: NOT_FOUND}, { status: 404});
        }

        const shlinkData = {
            ...mapModelToDtoShlinkMapper(result)
        }

        const dataDto:SHLinkEndpointDto = {
            shlinkId: shlinkData.id,
            serverConfigId: dto.server_config_id,
            urlPath: dto.url_path,
            id: dto.id ?? undefined
        }
        const endpoint = mapDtoToModel(dataDto as SHLinkEndpointDto)
        const endpointResult = await addEndpointUseCase({repo:shlEndpointRepo}, {endpoint:endpoint});
        
        return NextResponse.json(mapModelToDtoEndpoint(endpointResult), { status: 200 });
    }
    catch(error){
        return handleApiValidationError(error);
    }
}