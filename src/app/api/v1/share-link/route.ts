import { handleApiValidationError } from "@/app/utils/error-handler";
import { CreateSHLinkDto, SHLinkDto } from "@/domain/dtos/shlink";
import prisma from "@/infrastructure/clients/prisma";
import { SHLinkPrismaRepository } from "@/infrastructure/repositories/prisma/shlink-repository";
import { mapDtoToModel, mapEntityToModel, mapModelToDto } from "@/mappers/shlink-mapper";
import { addShlinkUseCase } from "@/usecases/shlinks/add-shlink";
import { NextResponse } from "next/server";

const repo = new SHLinkPrismaRepository(prisma);

export async function POST(request: Request) {
    let dto: CreateSHLinkDto = await request.json();

    try{
        const model = mapDtoToModel(dto as SHLinkDto)
        const newShlink = await addShlinkUseCase({ repo}, {shlink: model})
        return NextResponse.json(mapModelToDto(newShlink), { status: 200 });
    }
    catch(error){
        return handleApiValidationError(error);
    }
}

export async function GET(request: Request) {

    try{
        
        const newShlink = await repo.findMany({})
        return NextResponse.json(newShlink.map(shlink => mapModelToDto(mapEntityToModel(shlink))), { status: 200 });
    }
    catch(error){
        return handleApiValidationError(error);
    }
}