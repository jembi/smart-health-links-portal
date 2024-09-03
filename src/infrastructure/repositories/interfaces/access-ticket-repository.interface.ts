import { AccessTicketEntity } from '@/entities/access-ticket';
import { IRepository } from './repository.interface';

export interface IAccessTicketRepository extends IRepository<AccessTicketEntity> {}
