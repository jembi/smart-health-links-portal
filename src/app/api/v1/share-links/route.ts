import { NOT_FOUND } from "@/app/constants/http-constants";
import { handleApiValidationError } from "@/app/utils/error-handler";
import { validateUser } from "@/app/utils/authentication";
import { container, SHLinkRepositoryToken } from "@/container";
import { CreateSHLinkDto, SHLinkDto } from "@/domain/dtos/shlink";
import { SHLinkEntity } from "@/entities/shlink";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { 
    mapDtoToModel,
    mapEntityToModel, 
    mapModelToDto,
    mapModelToMiniDto
} from "@/mappers/shlink-mapper";
import { addShlinkUseCase } from "@/usecases/shlinks/add-shlink";
import { getSHLinkUseCase } from "@/usecases/shlinks/get-shlink";
import { NextResponse } from "next/server";

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
  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id');

    if(!userId) return NextResponse.json({ message: NOT_FOUND }, { status: 404 });

    try{
        await validateUser(request, userId);
        const newShlink:SHLinkEntity[] = await getSHLinkUseCase({ repo }, { user_id: userId })
        return NextResponse.json(newShlink.map(shlink => mapModelToMiniDto(mapEntityToModel(shlink))), { status: 200 });
    }
    catch(error){
        return handleApiValidationError(error);
    }
}
