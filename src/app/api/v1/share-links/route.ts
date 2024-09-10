import { NextResponse } from "next/server";

import { getUserProfile, validateUser } from "@/app/utils/authentication";
import { handleApiValidationError } from "@/app/utils/error-handler";
import { container, SHLinkRepositoryToken } from "@/container";
import { CreateSHLinkDto, SHLinkDto } from "@/domain/dtos/shlink";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { 
    mapDtoToModel,
    mapModelToDto,
    mapModelToMiniDto
} from "@/mappers/shlink-mapper";
import { addShlinkUseCase } from "@/usecases/shlinks/add-shlink";
import { getSHLinkUseCase } from "@/usecases/shlinks/get-shlink";

const repo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);

export async function POST(request: Request) {
    try{
        const dto: CreateSHLinkDto = await request.json();
        await validateUser(request, dto.userId);
        const model = mapDtoToModel(dto as SHLinkDto)
        const newShlink = await addShlinkUseCase({ repo }, { shlink: model })
        return NextResponse.json(mapModelToDto(newShlink), { status: 200 });
    }
    catch(error){
        return handleApiValidationError(error);
    }
}

export async function GET(request: Request) {
    try{
        const user = await getUserProfile(request);

        const newShlink = await getSHLinkUseCase({ repo }, { user_id: user.id })
        return NextResponse.json(newShlink.map(shlink => mapModelToMiniDto(shlink)), { status: 200 });
    }
    catch(error){
        return handleApiValidationError(error);
    }
}
