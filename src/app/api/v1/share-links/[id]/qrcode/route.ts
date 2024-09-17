import { NextResponse } from 'next/server';

import { NOT_FOUND } from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { container, SHLinkRepositoryToken } from '@/container';
import { SHLinkQRCodeRequestDto } from '@/domain/dtos/shlink-qrcode';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { LogHandler } from '@/lib/logger';
import { getSHLinkQRCodeUseCase } from '@/usecases/shlink-qrcode/get-shlink-qrcode';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';

const shlinkRepo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);

const logger = new LogHandler(__dirname);


/**
 * @swagger
 * /api/v1/share-links/{id}/qrcode:
 *   post:
 *     tags: [Share Link QR Code]
 *     description: Get Share link QR Code as an image.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: A string representing the share link's unique identifier.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SHLinkQRCodeRequest'
 *     responses:
 *       200:
 *         description: A PNG image of the share link's QR code.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 */

export async function POST(
  request: Request, 
  { params }: {params: { id: string } }, 
) {
  try {
    const { managementToken }: SHLinkQRCodeRequestDto = await request.json();
    const { id } = params;
    logger.log(`Creating a QR COde API with share link id: ${id} and managementToken: ${managementToken}`);

    let shlink = await getSingleSHLinkUseCase(
      { repo: shlinkRepo },
      { id, managementToken },
    );
    if (!shlink)
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });

    const imageBuffer = await getSHLinkQRCodeUseCase(shlink);

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length.toString(),
      },
    });
  } catch (error) {
    return handleApiValidationError(error, logger);
  }
}
