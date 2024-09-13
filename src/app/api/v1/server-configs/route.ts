import { NextResponse } from 'next/server';

import { handleApiValidationError } from '@/app/utils/error-handler';
import {Logger} from '@/app/utils/logger';
import { container, ServerConfigRepositoryToken } from '@/container';
import {
  CreateServerConfigDto,
  ServerConfigDto,
} from '@/domain/dtos/server-config';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { mapDtoToModel, mapModelToDto } from '@/mappers/server-config-mapper';
import { addServerConfigUseCase } from '@/usecases/server-configs/add-server-config';
import { getServerConfigsUseCase } from '@/usecases/server-configs/get-server-configs';

const repo = container.get<IServerConfigRepository>(
  ServerConfigRepositoryToken,
);
const route = "/api/v16/server-configs"
const logger = new Logger(route)

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
    logger.log('Creating server config API');
    let dto: CreateServerConfigDto = await request.json();
    try{
        const model = mapDtoToModel(dto as ServerConfigDto)
        const newServerConfig = await addServerConfigUseCase({ repo}, {server: model})
        return NextResponse.json(mapModelToDto(newServerConfig), { status: 201 });
    }
    catch(error){
        return handleApiValidationError(error, route);
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
    logger.log('Getting all server configs API');
    const serverConfigs = await getServerConfigsUseCase({ repo });
    return NextResponse.json(
        serverConfigs.map((x) => mapModelToDto(x)),
        { status: 200 },
    );
}
