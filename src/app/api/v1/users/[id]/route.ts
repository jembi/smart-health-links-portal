import { NextResponse } from 'next/server';

import { NOT_FOUND } from '@/app/constants/http-constants';
import { validateUser } from '@/app/utils/authentication';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { Logger } from '@/app/utils/logger';
import { container, UserRepositoryToken } from '@/container';
import { IUserRepository } from '@/infrastructure/repositories/interfaces/user-repository';
import { mapModelToDto } from '@/mappers/user-mapper';
import { getUserUseCase } from '@/usecases/users/get-user';

const repo = container.get<IUserRepository>(UserRepositoryToken);

const route = "api/v1/users/{id}"
const logger = new Logger(route)

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     tags: [Users]
 *     description: Get a user by id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: A string representing the user's unique identifier.
 *         required: true
 *     responses:
 *       200:
 *         description: User
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  logger.log("Retrieving a user")
  try {
    const { id } = params;
    validateUser(request, id);

    const result = await getUserUseCase({ repo }, { userId: id });
    if (result)
      return NextResponse.json(mapModelToDto(result), { status: 200 });

    return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
  } catch (error) {
    return handleApiValidationError(error, route);
  }
}
