import { NOT_FOUND } from '@/app/constants/http-constants';
import prisma from '@/infrastructure/clients/prisma';
import { UserPrismaRepository } from '@/infrastructure/repositories/prisma/user-repository';
import { mapModelToDto } from '@/mappers/user-mapper';
import { getUserUseCase } from '@/usecases/users/get-user';

const repo = new UserPrismaRepository(prisma);

import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const result = await getUserUseCase({ repo }, { userId: params.id });

  if (result) return NextResponse.json(mapModelToDto(result), { status: 200 });

  return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
}
