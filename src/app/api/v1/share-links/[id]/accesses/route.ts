import { NextResponse } from 'next/server';

import { NOT_FOUND } from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
import {
  container,
  SHLinkAccessRepositoryToken,
  SHLinkRepositoryToken,
} from '@/container';
import { SHLinkAccessRequestDto } from '@/domain/dtos/shlink-access';
import { ISHLinkAccessRepository } from '@/infrastructure/repositories/interfaces/shlink-access-repository';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { LogHandler } from '@/lib/logger';
import { mapModelToDto } from '@/mappers/shlink-access-mapper';
import { getSHLinkAccessesUseCase } from '@/usecases/shlink-access/get-shlink-accesses';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';

const repo = container.get<ISHLinkAccessRepository>(
  SHLinkAccessRepositoryToken,
);
const shlinkRepo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);

const logger = new LogHandler(__dirname);

/**
 * @swagger
 * /api/v1/share-links/{id}/accesses:
 *   post:
 *     tags: [Share Link Accesses]
 *     description: Get Share link Accesses.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: A string representing the share link's unique identifier.
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/SHLinkAccessRequest'
 *     responses:
 *       200:
 *         description: Share Link Accesses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SHLinkAccess'
 */
export async function POST(request: Request, params: { id: string }) {
  try {
    const { managementToken }: SHLinkAccessRequestDto = await request.json();
    logger.info(`Getting share link access for a user with share link id: ${params.id} and management token: ${managementToken}`);

    const shlink = await getSingleSHLinkUseCase(
      { repo: shlinkRepo },
      { id: params.id, managementToken: managementToken },
    );
    if (!shlink) {
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
    }

    const accesses = await getSHLinkAccessesUseCase(
      { repo },
      { shlinkId: shlink.getId() },
    );
    return NextResponse.json(
      accesses.map((x) => mapModelToDto(x)),
      { status: 200 },
    );
  } catch (error) {
    return handleApiValidationError(error, logger);
  }
}
