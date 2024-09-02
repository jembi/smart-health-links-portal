import { PrismaClient } from '@prisma/client';
import { ServerConfigPrismaRepository } from './infrastructure/repositories/prisma/server-config-repository';
import { UserPrismaRepository } from './infrastructure/repositories/prisma/user-repository';
import prisma from './infrastructure/clients/prisma';

export const ServerConfigRepositoryToken = Symbol('ServerConfigPrismaRepository');
export const UserRepositoryToken = Symbol('UserPrismaRepository');

export class Container {
    private services = new Map<symbol, any>();

    constructor() {
        this.services.set(ServerConfigRepositoryToken, new ServerConfigPrismaRepository(prisma));
        this.services.set(UserRepositoryToken, new UserPrismaRepository(prisma));
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
