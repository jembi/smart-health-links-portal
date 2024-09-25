import { unstable_noStore } from 'next/cache';
import { NextResponse } from 'next/server';

import {
  INVALID_SHLINK_CREDS,
  NOT_FOUND,
  UNAUTHORIZED_REQUEST,
} from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
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
import { LogHandler } from '@/lib/logger';
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

const logger = new LogHandler(__dirname);

/**
 * @swagger
 * /api/v1/share-links/{id}:
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
  unstable_noStore();
  let { passcode, recipient }: SHLinkRequestDto = await request.json();
  logger.info(
    `Creating share link access with share link id: ${params.id} and parameters: ${JSON.stringify({ recipient })}`,
  );
  try {
    let shlink = await getSingleSHLinkUseCase({ repo }, { id: params.id });
    if (!shlink)
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });

    const valid = await validateSHLinkUseCase({ shlink, passcode });
    if (!valid) {
      await decreasePasswordFailureCountUseCase({ repo }, shlink);
      return NextResponse.json(
        { message: getPasswordErrorMessage(shlink) },
        { status: 403 },
      );
    }
    await logSHLinkAccessUseCase(
      { repo: accessRepo },
      new SHLinkAccessModel(shlink.getId(), new Date(), recipient),
    );

    logger.info(
      `Creating a share link access ticket with share link id: ${params.id}`,
    );
    const ticket = await addAccessTicketUseCase(
      { repo: ticketRepo },
      new AccessTicketModel(shlink.getId()),
    );
    setTimeout(() => {
      logger.info(
        `Deleting share link access ticket with ticket: ${JSON.stringify(ticket)}`,
      );
      deleteAccessTicketUseCase({ repo: ticketRepo }, { id: ticket.getId() });
    }, DELETE_DELAY);
    const endpoint = await getEndpointUseCase(
      { repo: shlinkRepo },
      { shlinkId: shlink.getId() },
    );
    return NextResponse.json(
      mapModelToMiniDto(
        shlink,
        endpoint ? [endpoint] : [],
        ticket.getId(),
        false,
      ),
      { status: 200 },
    );
  } catch (error) {
    return handleApiValidationError(error, logger);
  }
}

/**
 * @swagger
 * /api/v1/share-links/{id}:
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
  unstable_noStore();
  let { managementToken, oldPasscode, passcode, expiryDate }: SHLinkUpdateDto =
    await request.json();
  logger.info(
    `Updating a share link passcode and expiry date API with share link id: ${params.id} and parameters: ${JSON.stringify({ managementToken, expiryDate })}`,
  );
  try {
    let shlink = await getSingleSHLinkUseCase(
      { repo },
      { id: params.id, managementToken },
    );

    if (!shlink)
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });

    const valid: boolean = await validateSHLinkUseCase({
      shlink,
      passcode: oldPasscode,
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
        passcode,
        expiryDate: expiryDate && new Date(expiryDate),
      },
    );

    if (updateShlink)
      return NextResponse.json(mapModelToDto(updateShlink), { status: 200 });
  } catch (error) {
    return handleApiValidationError(error, logger);
  }
}
