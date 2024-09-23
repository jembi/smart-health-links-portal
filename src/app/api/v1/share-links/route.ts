import { unstable_noStore } from 'next/cache';
import { NextResponse } from 'next/server';

import { getUserProfile, validateUser } from '@/app/utils/authentication';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { validateSHLinkStatusParameter } from '@/app/utils/validate';
import { container, SHLinkRepositoryToken } from '@/container';
import { CreateSHLinkDto, SHLinkDto } from '@/domain/dtos/shlink';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { LogHandler } from '@/lib/logger';
import {
  mapDtoToModel,
  mapModelToDto,
  mapModelToMiniDto,
} from '@/mappers/shlink-mapper';
import { addShlinkUseCase } from '@/usecases/shlinks/add-shlink';
import { getSHLinkUseCase } from '@/usecases/shlinks/get-shlink';

export const dynamic = 'force-dynamic';

const repo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);

const logger = new LogHandler(__dirname);

/**
 * @swagger
 * /api/v1/share-links:
 *   post:
 *     tags: [Share Links]
 *     description: Create a server config.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/CreateSHLink'
 *     responses:
 *       200:
 *         description: Create Server Config
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/SHLink'
 */
export async function POST(request: Request) {
  try {
    unstable_noStore();
    const dto: CreateSHLinkDto = await request.json();
    logger.info(
      `Creating a share link API with parameters, ${JSON.stringify({ name: dto.name, userId: dto.userId })}`,
    );
    await validateUser(request, dto.userId);
    const model = mapDtoToModel(dto as SHLinkDto);
    const newShlink = await addShlinkUseCase({ repo }, { shlink: model });
    return NextResponse.json(mapModelToDto(newShlink), { status: 200 });
  } catch (error) {
    return handleApiValidationError(error, logger);
  }
}

/**
 * @swagger
 * /api/v1/share-links:
 *   get:
 *     tags: [Share Links]
 *     description: Get share links
 *      parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, expired]
 *         description: Filter share links by status.
 *     responses:
 *       200:
 *         description: Gets all the signed in user's share links.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SHLinkMini'
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  let status: string | null = searchParams.get('status')?.toLowerCase() || null

  try {
    unstable_noStore();

    validateSHLinkStatusParameter({status});
    const { id } = await getUserProfile(request);

    logger.info(`Getting all share links by user with user id: ${id}`);

    const newShlink = await getSHLinkUseCase({ repo }, { user_id: id, status });
    return NextResponse.json(
      newShlink.map((shlink) => mapModelToMiniDto(shlink)),
      { status: 200 },
    );
  } catch (error) {
    return handleApiValidationError(error, logger);
  }
}
