import { NOT_FOUND } from "@/app/constants/http-constants";
import { handleApiValidationError } from "@/app/utils/error-handler";
import { container, SHLinkAccessRepositoryToken, SHLinkRepositoryToken } from "@/container";
import { SHLinkRequestDto } from "@/domain/dtos/shlink";
import { SHLinkAccessModel } from "@/domain/models/shlink-access";
import { ISHLinkAccessRepository } from "@/infrastructure/repositories/interfaces/shlink-access-repository";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { mapModelToDto } from "@/mappers/shlink-mapper";
import { logSHLinkAccess } from "@/usecases/shlink-access/log-shlink-access";
import { getSingleSHLinkUseCase } from "@/usecases/shlinks/get-single-shlink";
import { NextResponse } from "next/server";

const repo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);
const accessRepo = container.get<ISHLinkAccessRepository>(SHLinkAccessRepositoryToken);

export async function POST(request: Request, { params }: { params: { id: string } }) {
    let requestDto: SHLinkRequestDto = await request.json();
    try{
        let shlink = await getSingleSHLinkUseCase({ repo}, {id: params.id})
        if(!shlink) return NextResponse.json({message: NOT_FOUND}, { status: 404 });

        await logSHLinkAccess({repo: accessRepo}, new SHLinkAccessModel(shlink.getId(), new Date(), requestDto.recipient));
        return NextResponse.json(mapModelToDto(shlink), { status: 200 });
    }
    catch(error){
        return handleApiValidationError(error);
    }
}