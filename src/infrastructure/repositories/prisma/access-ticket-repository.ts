import { BasePrismaRepository } from './base-repository';
import { PrismaClient } from '@prisma/client';
import { AccessTicketEntity } from '@/entities/access-ticket';
import { IAccessTicketRepository } from '../interfaces/access-ticket-repository.interface';

export class AccessTicketPrismaRepository
  extends BasePrismaRepository<AccessTicketEntity>
  implements IAccessTicketRepository
{
  constructor(prismaClient: PrismaClient) {
    super(prismaClient, 'access_ticket');
  }
}
