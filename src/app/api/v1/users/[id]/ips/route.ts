import { NextResponse } from 'next/server';

import { NOT_FOUND } from '@/app/constants/http-constants';
import { validateUser } from '@/app/utils/authentication';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { Logger } from '@/app/utils/logger';
import {
  container,
  ServerConfigRepositoryToken,
  UserRepositoryToken,
} from '@/container';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { IUserRepository } from '@/infrastructure/repositories/interfaces/user-repository';
import { getPatientDataUseCase } from '@/usecases/patient/get-patient-data';
import { getUserUseCase } from '@/usecases/users/get-user';

const userRepo = container.get<IUserRepository>(UserRepositoryToken);
const serverConfigRepo = container.get<IServerConfigRepository>(
  ServerConfigRepositoryToken,
);

const route = "/api/v1/users/{id}/ips"
const logger = new Logger(route)


/**
 * @swagger
 * /api/v1/users/{id}/ips:
 *   get:
 *     tags: [Users]
 *     description: Get a user's patient summary data.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: A string representing the user's unique identifier.
 *         required: true
 *     responses:
 *       200:
 *         description: International Patient Summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  logger.log("Retrieving user's patient summary data")
  try {
    await validateUser(request, params.id);
    const user = await getUserUseCase(
      { repo: userRepo },
      { userId: params.id },
    );
    if (!user)
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
    const result = await getPatientDataUseCase(
      { repo: serverConfigRepo },
      { user },
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleApiValidationError(error, route);
  }
}
