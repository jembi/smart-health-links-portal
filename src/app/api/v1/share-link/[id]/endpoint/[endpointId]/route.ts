import { NOT_FOUND } from '@/app/constants/http-constants';
import prisma from '@/infrastructure/clients/prisma';
import { SHLinkEndpointPrismaRepository } from '@/infrastructure/repositories/prisma/shlink-endpoint-repository';
import { mapModelToDto } from '@/mappers/shlink-endpoint-mapper';
import { getEndpointUseCase } from '@/usecases/shlink-endpoint/get-endpoint';


const repo = new SHLinkEndpointPrismaRepository(prisma);

import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { endpointId: string } },
) {
  const result = await getEndpointUseCase({ repo }, { id: params.endpointId });

  if (result) return NextResponse.json(mapModelToDto(result), { status: 200 });

  return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
}
