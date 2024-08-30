import { handleApiValidationError } from '@/app/utils/error-handler';
import {
  CreateServerConfigDto,
  ServerConfigDto,
} from '@/domain/dtos/server-config';
import prisma from '@/infrastructure/clients/prisma';
import { ServerConfigPrismaRepository } from '@/infrastructure/repositories/prisma/server-config-repository';
import { mapDtoToModel, mapModelToDto } from '@/mappers/server-config-mapper';
import { addServerConfigUseCase } from '@/usecases/server-configs/add-server-config';
import { getServerConfigsUseCase } from '@/usecases/server-configs/get-server-configs';
import { NextResponse } from 'next/server';

const repo = new ServerConfigPrismaRepository(prisma);

export async function POST(request: Request) {
  let dto: CreateServerConfigDto = await request.json();
  try {
    const model = mapDtoToModel(dto as ServerConfigDto);
    const newServerConfig = await addServerConfigUseCase(
      { repo },
      { server: model },
    );
    return NextResponse.json(mapModelToDto(newServerConfig), { status: 201 });
  } catch (error) {
    return handleApiValidationError(error);
  }
}

export async function GET(request: Request) {
  const serverConfigs = await getServerConfigsUseCase({ repo });
  return NextResponse.json(
    serverConfigs.map((x) => mapModelToDto(x)),
    { status: 200 },
  );
}
