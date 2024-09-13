import { NextResponse } from 'next/server';

import { NOT_FOUND } from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { Logger } from '@/app/utils/logger';
import {
  container,
  SHLinkAccessRepositoryToken,
  SHLinkRepositoryToken,
} from '@/container';
import { SHLinkAccessRequestDto } from '@/domain/dtos/shlink-access';
import { ISHLinkAccessRepository } from '@/infrastructure/repositories/interfaces/shlink-access-repository';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapModelToDto } from '@/mappers/shlink-access-mapper';
import { getSHLinkAccessesUseCase } from '@/usecases/shlink-access/get-shlink-accesses';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';

const repo = container.get<ISHLinkAccessRepository>(
  SHLinkAccessRepositoryToken,
);
const shlinkRepo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);

const route = "api/v1/share-links/{id}/accesses"
const logger = new Logger(route)

/**
 * @swagger
 * /api/v1/shlinks/{id}/accesses:
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
  logger.log('Getting share link access for a user');
  try {
    const dto: SHLinkAccessRequestDto = await request.json();
    const shlink = await getSingleSHLinkUseCase(
      { repo: shlinkRepo },
      { id: params.id, managementToken: dto.managementToken },
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
    return handleApiValidationError(error, route);
  }
}
