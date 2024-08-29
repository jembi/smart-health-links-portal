import { NOT_FOUND } from "@/app/constants/http-constants";
import { handleApiValidationError } from "@/app/utils/error-handler";
import { CreateSHLinkDto, SHLinkDto } from "@/domain/dtos/shlink";
import { SHLinkEntity } from "@/entities/shlink";
import prisma from "@/infrastructure/clients/prisma";
import { SHLinkPrismaRepository } from "@/infrastructure/repositories/prisma/shlink-repository";
import { mapDtoToModel, mapEntityToModel, mapModelToDto } from "@/mappers/shlink-mapper";
import { addShlinkUseCase } from "@/usecases/shlinks/add-shlink";
import { getSHLinkUseCase } from "@/usecases/shlinks/get-shlink";
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
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');

    if(!userId) return NextResponse.json({message: NOT_FOUND}, { status: 422});

    try{
        const newShlink:SHLinkEntity[] = await getSHLinkUseCase({ repo}, {user_id: userId})
        return NextResponse.json(newShlink.map(shlink => mapModelToDto(mapEntityToModel(shlink))), { status: 200 });
    }
    catch(error){
        return handleApiValidationError(error);
    }
}