import { unstable_noStore } from 'next/cache';
import { NextResponse } from 'next/server';

import { validateUserRoles } from '@/app/utils/authentication';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { container, ServerConfigRepositoryToken } from '@/container';
import {
  CreateServerConfigDto,
  ServerConfigDto,
} from '@/domain/dtos/server-config';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { LogHandler } from '@/lib/logger';
import { mapDtoToModel, mapModelToDto } from '@/mappers/server-config-mapper';
import { addServerConfigUseCase } from '@/usecases/server-configs/add-server-config';
import { getServerConfigsUseCase } from '@/usecases/server-configs/get-server-configs';

export const dynamic = 'force-dynamic';

const repo = container.get<IServerConfigRepository>(
  ServerConfigRepositoryToken,
);
const logger = new LogHandler(__dirname);

/**
 * @swagger
 * /api/v1/server-configs:
 *   post:
 *     tags: [Admin]
 *     description: Create a server config.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/CreateServerConfig'
 *     responses:
 *       200:
 *         description: Create Server Config
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/ServerConfig'
 */
export async function POST(request: Request) {
  let dto: CreateServerConfigDto = await request.json();
  logger.info(
    `Creating server config API with request: ${JSON.stringify(dto)}`,
  );
  try {
    unstable_noStore();
    await validateUserRoles(request, 'admin');
    const model = mapDtoToModel(dto as ServerConfigDto);
    const newServerConfig = await addServerConfigUseCase(
      { repo },
      { server: model },
    );
    return NextResponse.json(mapModelToDto(newServerConfig), { status: 201 });
  } catch (error) {
    return handleApiValidationError(error, logger);
  }
}

/**
 * @swagger
 * /api/v1/server-configs:
 *   get:
 *     tags: [Admin]
 *     description: Gets all server configs
 *     responses:
 *       200:
 *         description: Server Configs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/ServerConfig'
 */
export async function GET(request: Request) {
  try {
    unstable_noStore();
    logger.info(`Getting all available server configs data`);
    await validateUserRoles(request, 'admin');
    const serverConfigs = await getServerConfigsUseCase({ repo });
    return NextResponse.json(
      serverConfigs.map((x) => mapModelToDto(x)),
      { status: 200 },
    );
  } catch (error) {
    return handleApiValidationError(error, logger);
  }
}
