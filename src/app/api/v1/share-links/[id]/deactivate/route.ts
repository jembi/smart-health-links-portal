import { NextResponse } from "next/server";

import { NOT_FOUND } from "@/app/constants/http-constants";
import { getUserProfile } from "@/app/utils/authentication";
import { handleApiValidationError } from "@/app/utils/error-handler";
import { container, SHLinkRepositoryToken } from "@/container";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { mapModelToDto } from "@/mappers/shlink-mapper";
import { deactivateSHLinksUseCase } from "@/usecases/shlinks/deactivate-shlink";

const repo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try{
      const user = await getUserProfile(request);
      const result = await deactivateSHLinksUseCase({ repo }, { id: params.id, user });
      const data = mapModelToDto(result);
      if(result) return NextResponse.json(data, { status: 200 });
      return NextResponse.json({ message: NOT_FOUND }, { status: 404});
  }
  catch(error){
      return handleApiValidationError(error);
  }
}
