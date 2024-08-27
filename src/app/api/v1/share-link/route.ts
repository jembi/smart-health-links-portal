import { handleApiValidationError } from "@/app/utils/error-handler";
import { CreateShlinkDto, ShlinkDto } from "@/domain/dtos/shlink";
import prisma from "@/infrastructure/clients/prisma";
import { SHLinkPrismaRepository } from "@/infrastructure/repositories/prisma/shlink-repository";
import { mapDtoToModel, mapModelToDto } from "@/mappers/shlink-mapper";
import { addShlinkUseCase } from "@/usecases/shlinks/add-shlink";
import { NextResponse } from "next/server";

const repo = new SHLinkPrismaRepository(prisma);

export async function POST(request: Request) {
    let dto: CreateShlinkDto = await request.json();
    dto.configExp = new Date(dto.configExp)
    try{
        const model = mapDtoToModel(dto as ShlinkDto)
        const newShlink = await addShlinkUseCase({ repo}, {shlink: model})
        return NextResponse.json(mapModelToDto(newShlink), { status: 201 });
    }
    catch(error){
        return handleApiValidationError(error);
    }
}