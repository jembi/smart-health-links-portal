import { handleApiValidationError } from '@/app/utils/error-handler';
import { CreateUserDto, UserDto } from '@/domain/dtos/user';
import prisma from '@/infrastructure/clients/prisma';
import { UserPrismaRepository } from '@/infrastructure/repositories/prisma/user-repository';
import { mapDtoToModel, mapModelToDto } from '@/mappers/user-mapper';
import { addUserUseCase } from '@/usecases/users/add-user';
import { NextResponse } from 'next/server';

const repo = new UserPrismaRepository(prisma);

export async function POST(request: Request) {
  let dto: CreateUserDto = await request.json();
  try {
    const model = mapDtoToModel(dto as UserDto);
    const newUser = await addUserUseCase({ repo }, { user: model });
    return NextResponse.json(mapModelToDto(newUser), { status: 201 });
  } catch (error) {
    return handleApiValidationError(error);
  }
}
