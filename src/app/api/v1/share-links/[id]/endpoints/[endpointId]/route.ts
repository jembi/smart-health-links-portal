import { NextResponse } from 'next/server';

import {
  NOT_FOUND,
  UNAUTHORIZED_REQUEST,
} from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
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

export async function GET(
  request: Request,
  { params }: { params: { id: string; endpointId: string } },
) {
  const url = new URL(request.url);

  const ticketId = url.searchParams.get('ticket');

  try {
    const ticket: AccessTicketModel = await getAccessTicketUseCase(
      { repo: ticketRepo },
      ticketId,
    );

    if (!ticket) {
      return NextResponse.json(
        { message: UNAUTHORIZED_REQUEST },
        { status: 401 },
      );
    }

    if (ticket.getSHLinkId() !== params.id) {
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
    }

    const shlink = await getSingleSHLinkUseCase(
      { repo: shlinkRepo },
      { id: params.id },
    );

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
    return handleApiValidationError(error);
  }
}
