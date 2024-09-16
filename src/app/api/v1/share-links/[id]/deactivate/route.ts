import { NextResponse } from 'next/server';

import { NOT_FOUND } from '@/app/constants/http-constants';
import { getUserProfile } from '@/app/utils/authentication';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { container, SHLinkRepositoryToken } from '@/container';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapModelToDto } from '@/mappers/shlink-mapper';
import { deactivateSHLinksUseCase } from '@/usecases/shlinks/deactivate-shlink';

const repo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);

/**
 * @swagger
 * /api/v1/share-links/{id}/deactivate:
 *   delete:
 *     tags: [Share Links]
 *     description: Deactivate a share link.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: A string representing the share link's unique identifier.
 *         required: true
 *     responses:
 *       200:
 *         description: Deactivated Share Link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/SHLinkMini'
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getUserProfile(request);
    const result = await deactivateSHLinksUseCase(
      { repo },
      { id: params.id, user },
    );
    const data = mapModelToDto(result);
    if (result) return NextResponse.json(data, { status: 200 });
    return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
  } catch (error) {
    return handleApiValidationError(error);
  }
}
