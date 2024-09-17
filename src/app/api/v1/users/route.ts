import { NextResponse } from 'next/server';

import { handleApiValidationError } from '@/app/utils/error-handler';
import {
  container,
  ServerConfigRepositoryToken,
  UserRepositoryToken,
} from '@/container';
import { CreateUserDto, UserDto } from '@/domain/dtos/user';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { IUserRepository } from '@/infrastructure/repositories/interfaces/user-repository';
import { LogHandler } from '@/lib/logger';
import { mapDtoToModel, mapModelToDto } from '@/mappers/user-mapper';
import { searchPatientUseCase } from '@/usecases/patient/search-patient';
import { addUserUseCase } from '@/usecases/users/add-user';

const repo = container.get<IUserRepository>(UserRepositoryToken);
const serverConfigRepo = container.get<IServerConfigRepository>(
  ServerConfigRepositoryToken,
);

const logger = new LogHandler(__dirname);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     tags: [Users]
 *     description: Creates a new user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       200:
 *         description: A new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 */
export async function POST(request: Request) {
  let dto: CreateUserDto = await request.json();
  logger.log(`Creating a user with, ${dto}`);
  try {
    const patientId = await searchPatientUseCase(
      { repo: serverConfigRepo },
      { patientId: dto.patientId },
    );
    dto.patientId = patientId;
    const model = mapDtoToModel(dto as UserDto);
    const newUser = await addUserUseCase({ repo }, { user: model });
    return NextResponse.json(mapModelToDto(newUser), { status: 201 });
  } catch (error) {
    return handleApiValidationError(error, logger);
  }
}
