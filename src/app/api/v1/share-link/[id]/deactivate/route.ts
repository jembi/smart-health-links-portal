import { handleApiValidationError } from "@/app/utils/error-handler";
import { CreateSHLinkDto, SHLinkDto } from "@/domain/dtos/shlink";
import prisma from "@/infrastructure/clients/prisma";
import { SHLinkPrismaRepository } from "@/infrastructure/repositories/prisma/shlink-repository";
import { mapDtoToModel, mapEntityToModel, mapModelToDto } from "@/mappers/shlink-mapper";
import { deactivatedSHLinksUseCase } from "@/usecases/shlinks/get-shlink";
import { NextResponse } from "next/server";
import { NOT_FOUND } from "@/app/constants/http-constants";

const repo = new SHLinkPrismaRepository(prisma);

  export async function GET(request: Request, { params }: { params: { id: string } }) {

    try{
        const result = await deactivatedSHLinksUseCase({repo}, {id: params.id});
        const data = {
          ...mapModelToDto(result),
          message: "deactivated"
        }
        if(result) return NextResponse.json(data, { status: 200 });
        return NextResponse.json({message: NOT_FOUND}, { status: 404});
    }
    catch(error){
        return handleApiValidationError(error);
    }
}