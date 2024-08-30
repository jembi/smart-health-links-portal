import { NOT_FOUND } from "@/app/constants/http-constants";
import { handleApiValidationError } from "@/app/utils/error-handler";
import prisma from "@/infrastructure/clients/prisma";
import { SHLinkPrismaRepository } from "@/infrastructure/repositories/prisma/shlink-repository";
import { mapModelToDto } from "@/mappers/shlink-mapper";
import { getSingleSHLinkUseCase } from "@/usecases/shlinks/get-single-shlink";
import { NextResponse } from "next/server";

const repo = new SHLinkPrismaRepository(prisma);

export async function GET(request: Request, { params }: { params: { id: string } }) {

    try{
        let shlink = await getSingleSHLinkUseCase({ repo}, {id: params.id})
        if(!shlink && shlink === undefined) return NextResponse.json({message: NOT_FOUND}, { status: 404 });
        return NextResponse.json(mapModelToDto(shlink), { status: 200 });
    }
    catch(error){
        return handleApiValidationError(error);
    }
}