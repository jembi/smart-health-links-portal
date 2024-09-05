import { NOT_FOUND,UNAUTHORIZED_REQUEST } from '@/app/constants/http-constants';
import { container, ServerConfigRepositoryToken, UserRepositoryToken } from '@/container';
import { AccessTicketModel } from '@/domain/models/access-ticket';
import prisma from '@/infrastructure/clients/prisma';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { IUserRepository } from '@/infrastructure/repositories/interfaces/user-repository';
import { AccessTicketPrismaRepository } from '@/infrastructure/repositories/prisma/access-ticket-repository';
import { SHLinkPrismaRepository } from '@/infrastructure/repositories/prisma/shlink-repository';
import { getAccessTicketUseCase } from '@/usecases/access-tickets/get-access-ticket';
import { getPatientDataUseCase } from '@/usecases/patient/get-patient-data';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';
import { getUserUseCase } from '@/usecases/users/get-user';


const shlinkRepo = new SHLinkPrismaRepository(prisma);
const ticketRepo = new AccessTicketPrismaRepository(prisma);
const userRepo = container.get<IUserRepository>(UserRepositoryToken);
const serverConfigRepo = container.get<IServerConfigRepository>(ServerConfigRepositoryToken);


import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id:string, endpointId: string } },
) {

  const url = new URL(request.url);
  const ticketId = url.searchParams.get('ticket');
  
  const ticket:AccessTicketModel = await getAccessTicketUseCase({repo:ticketRepo}, ticketId)

  if (!ticket) {
    return NextResponse.json({message:UNAUTHORIZED_REQUEST}, { status: 401 });
  }
  
  if (ticket?.getSHLinkId() !== params.id) {
    return NextResponse.json({message:NOT_FOUND}, { status: 401 });
  }   
  
  const shlink = await getSingleSHLinkUseCase({ repo:shlinkRepo}, { id: params.id });

  const user = await getUserUseCase({ repo:userRepo }, { userId: shlink.getUserId() });
  
  const patient = await getPatientDataUseCase({ repo:serverConfigRepo }, { user: user });

  if(patient){
    return NextResponse.json(patient, { status: 200 });
  }

  return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
}
