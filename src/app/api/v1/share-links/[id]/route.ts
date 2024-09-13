import { NextResponse } from 'next/server';

import {
  INVALID_SHLINK_CREDS,
  NOT_FOUND,
  UNAUTHORIZED_REQUEST,
} from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { Logger } from '@/app/utils/logger';
import {
  AccessTicketRepositoryToken,
  container,
  SHLinkAccessRepositoryToken,
  SHLinkEndpointRepositoryToken,
  SHLinkRepositoryToken,
} from '@/container';
import { SHLinkRequestDto, SHLinkUpdateDto } from '@/domain/dtos/shlink';
import { AccessTicketModel } from '@/domain/models/access-ticket';
import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkAccessModel } from '@/domain/models/shlink-access';
import { IAccessTicketRepository } from '@/infrastructure/repositories/interfaces/access-ticket-repository.interface';
import { ISHLinkAccessRepository } from '@/infrastructure/repositories/interfaces/shlink-access-repository';
import { ISHLinkEndpointRepository } from '@/infrastructure/repositories/interfaces/shlink-endpoint-repository';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { mapModelToMiniDto, mapModelToDto } from '@/mappers/shlink-mapper';
import { addAccessTicketUseCase } from '@/usecases/access-tickets/add-access-ticket';
import { deleteAccessTicketUseCase } from '@/usecases/access-tickets/delete-access-ticket';
import { logSHLinkAccessUseCase } from '@/usecases/shlink-access/log-shlink-access';
import { getEndpointUseCase } from '@/usecases/shlink-endpoint/get-endpoint';
import { decreasePasswordFailureCountUseCase } from '@/usecases/shlinks/decrease-password-failure';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';
import { updateSingleSHLinkUseCase } from '@/usecases/shlinks/update-single-shlink';
import { validateSHLinkUseCase } from '@/usecases/shlinks/validate-shlink';

const repo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);
const accessRepo = container.get<ISHLinkAccessRepository>(
  SHLinkAccessRepositoryToken,
);
const ticketRepo = container.get<IAccessTicketRepository>(
  AccessTicketRepositoryToken,
);
const shlinkRepo = container.get<ISHLinkEndpointRepository>(
  SHLinkEndpointRepositoryToken,
);
const DELETE_DELAY = 60000;

const getPasswordErrorMessage = (shlink: SHLinkModel): string => {
  return INVALID_SHLINK_CREDS.replace(
    /%s/g,
    (shlink.getPasscodeFailuresRemaining() - 1).toString(),
  );
};

const route = "api/v1/share-links/{id}"
const logger = new Logger(route)

/**
 * @swagger
 * /api/v1/shlinks/{id}:
 *   post:
 *     tags: [Share Links]
 *     description: Get a share link.
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
 *             $ref: '#/components/schemas/SHLinkRequest'
 *     responses:
 *       200:
 *         description: Get Share Link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/SHLinkMini'
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  logger.log('Updating a share link with a ticket and creating share link access');
  let requestDto: SHLinkRequestDto = await request.json();
  try {
    let shlink = await getSingleSHLinkUseCase(
      { repo },
      { id: params.id, managementToken: requestDto.managementToken },
    );
    if (!shlink)
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });

    const valid = await validateSHLinkUseCase({
      shlink,
      passcode: requestDto.passcode,
    });
    if (!valid) {
      await decreasePasswordFailureCountUseCase({ repo }, shlink);
      return NextResponse.json(
        { message: getPasswordErrorMessage(shlink) },
        { status: 403 },
      );
    }
    await logSHLinkAccessUseCase(
      { repo: accessRepo },
      new SHLinkAccessModel(shlink.getId(), new Date(), requestDto.recipient),
    );
    const ticket = await addAccessTicketUseCase(
      { repo: ticketRepo },
      new AccessTicketModel(shlink.getId()),
    );
    setTimeout(() => {
      deleteAccessTicketUseCase({ repo: ticketRepo }, { id: ticket.getId() });
    }, DELETE_DELAY);
    const endpoint = await getEndpointUseCase(
      { repo: shlinkRepo },
      { shlinkId: shlink.getId() },
    );
    return NextResponse.json(
      mapModelToMiniDto(shlink, [endpoint], ticket.getId()),
      { status: 200 },
    );
  } catch (error) {
    return handleApiValidationError(error, route);
  }
}

/**
 * @swagger
 * /api/v1/shlinks/{id}:
 *   put:
 *     tags: [Share Links]
 *     description: Update A Share link.
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
 *             $ref: '#/components/schemas/SHLinkUpdate'
 *     responses:
 *       200:
 *         description: Updated Share Link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/SHLinkMini'
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  logger.log('Updating a share link passcode and expiry date API');
  let requestDto: SHLinkUpdateDto = await request.json();

  try {
    let shlink = await getSingleSHLinkUseCase(
      { repo },
      { id: params.id, managementToken: requestDto.managementToken },
    );

    if (!shlink)
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });

    const valid: boolean = await validateSHLinkUseCase({
      shlink,
      passcode: requestDto.oldPasscode,
    });

    if (!valid) {
      return NextResponse.json(
        { message: UNAUTHORIZED_REQUEST },
        { status: 401 },
      );
    }

    let updateShlink = await updateSingleSHLinkUseCase(
      { repo, validator: validateSHLinkUseCase },
      {
        id: params.id,
        passcode: requestDto.passcode,
        expiryDate: requestDto.expiryDate && new Date(requestDto.expiryDate),
      },
    );

    if (updateShlink)
      return NextResponse.json(mapModelToDto(updateShlink), { status: 200 });
  } catch (error) {
    return handleApiValidationError(error, route);
  }
}
