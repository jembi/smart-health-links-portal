import { NextResponse } from "next/server";

import { NOT_FOUND } from "@/app/constants/http-constants";
import { handleApiValidationError } from "@/app/utils/error-handler";
import { container, SHLinkAccessRepositoryToken, SHLinkRepositoryToken } from "@/container";
import { SHLinkAccessRequestDto } from "@/domain/dtos/shlink-access";
import { ISHLinkAccessRepository } from "@/infrastructure/repositories/interfaces/shlink-access-repository";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { mapModelToDto } from "@/mappers/shlink-access-mapper";
import { getSHLinkAccessesUseCase } from "@/usecases/shlink-access/get-shlink-accesses";
import { getSingleSHLinkUseCase } from "@/usecases/shlinks/get-single-shlink";

const repo = container.get<ISHLinkAccessRepository>(SHLinkAccessRepositoryToken);
const shlinkRepo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);

export async function POST(request: Request, params: {id: string }) {
    try{
        const dto: SHLinkAccessRequestDto = await request.json();
        const shlink = await getSingleSHLinkUseCase({ repo: shlinkRepo }, { id: params.id, managementToken: dto.managementToken });
        if(!shlink){
            return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
        }
        
        const accesses = await getSHLinkAccessesUseCase({ repo }, { shlinkId: shlink.getId() });
        return NextResponse.json(accesses.map(x => mapModelToDto(x)), { status: 200 });
    }
    catch(error){
          return handleApiValidationError(error);
    }
}