import { NextResponse } from 'next/server';

import {
  NOT_FOUND,
  UNAUTHORIZED_REQUEST,
} from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { Logger } from '@/app/utils/logger';
import {
  AccessTicketRepositoryToken,
  container,
  ServerConfigRepositoryToken,
  SHLinkRepositoryToken,
  UserRepositoryToken,
} from '@/container';
import { AccessTicketModel } from '@/domain/models/access-ticket';
import { IAccessTicketRepository } from '@/infrastructure/repositories/interfaces/access-ticket-repository.interface';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { IUserRepository } from '@/infrastructure/repositories/interfaces/user-repository';
import { getAccessTicketUseCase } from '@/usecases/access-tickets/get-access-ticket';
import { getPatientDataUseCase } from '@/usecases/patient/get-patient-data';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';
import { getUserUseCase } from '@/usecases/users/get-user';

const shlinkRepo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);
const ticketRepo = container.get<IAccessTicketRepository>(
  AccessTicketRepositoryToken,
);
const userRepo = container.get<IUserRepository>(UserRepositoryToken);
const serverConfigRepo = container.get<IServerConfigRepository>(
  ServerConfigRepositoryToken,
);

const route = "api/v1/share-links/{id}/endpoints/{endpointId}"
const logger = new Logger(route)

/**
 * @swagger
 * /api/v1/share-links/{id}/endpoints/{endpointId}:
 *   get:
 *     tags: [Share Link Endpoints]
 *     description: Get a share link endpoint.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: A string representing the share link's unique identifier.
 *         required: true
 *       - name: endpointId
 *         in: path
 *         description: A string representing the share link endpoint's unique identifier.
 *         required: true
 *     responses:
 *       200:
 *         description: Get Share Link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string; endpointId: string } },
) {
  logger.log('Getting an endpoint data');
  const url = new URL(request.url);

  const ticketId = url.searchParams.get('ticket');

  try {
    const ticket: AccessTicketModel = await getAccessTicketUseCase(
      { repo: ticketRepo },
      ticketId,
    );

    if (!ticket || ticket.getSHLinkId() !== params.id) {
      return NextResponse.json(
        { message: UNAUTHORIZED_REQUEST },
        { status: 401 },
      );
    }

    const shlink = await getSingleSHLinkUseCase(
      { repo: shlinkRepo },
      { id: params.id },
    );

    if (!shlink)
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });

    const user = await getUserUseCase(
      { repo: userRepo },
      { userId: shlink.getUserId() },
    );

    const patient = await getPatientDataUseCase(
      { repo: serverConfigRepo },
      { user: user },
    );

    return NextResponse.json(patient, { status: 200 });
  } catch (error) {
    return handleApiValidationError(error, route);
  }
}
