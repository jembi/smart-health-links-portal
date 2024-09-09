import prisma from './infrastructure/clients/prisma';
import { AccessTicketPrismaRepository } from './infrastructure/repositories/prisma/access-ticket-repository';
import { ServerConfigPrismaRepository } from './infrastructure/repositories/prisma/server-config-repository';
import { SHLinkAccessPrismaRepository } from './infrastructure/repositories/prisma/shlink-access-repository';
import { SHLinkEndpointPrismaRepository } from './infrastructure/repositories/prisma/shlink-endpoint-repository';
import { SHLinkPrismaRepository } from './infrastructure/repositories/prisma/shlink-repository';
import { UserPrismaRepository } from './infrastructure/repositories/prisma/user-repository';

export const ServerConfigRepositoryToken = Symbol('ServerConfigPrismaRepository');
export const UserRepositoryToken = Symbol('UserPrismaRepository');
export const SHLinkRepositoryToken = Symbol('SHLinkRepository');
export const SHLinkAccessRepositoryToken = Symbol('SHLinkAccessRepository');
export const AccessTicketRepositoryToken = Symbol('AccessTicketRepository');
export const SHLinkEndpointRepositoryToken = Symbol('SHLinkEndpointRepository');

export class Container {
    private services = new Map<symbol, any>();

    constructor() {
        this.services.set(ServerConfigRepositoryToken, new ServerConfigPrismaRepository(prisma));
        this.services.set(UserRepositoryToken, new UserPrismaRepository(prisma));
        this.services.set(SHLinkRepositoryToken, new SHLinkPrismaRepository(prisma));
        this.services.set(SHLinkAccessRepositoryToken, new SHLinkAccessPrismaRepository(prisma));
        this.services.set(AccessTicketRepositoryToken, new AccessTicketPrismaRepository(prisma));
        this.services.set(SHLinkEndpointRepositoryToken, new SHLinkEndpointPrismaRepository(prisma));
    }

    public get<T>(token: symbol): T {
        const instance = this.services.get(token);
        if (!instance) {
            throw new Error(`Service not found: ${token.toString()}`);
        }
        return instance;
    }
}

export const container = new Container();
