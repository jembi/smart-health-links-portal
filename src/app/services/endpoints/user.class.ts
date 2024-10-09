import { type AxiosInstance } from 'axios';

import { BaseApi, instance } from '../api.class';
import {
  EPath,
  type IPathMapTypes,
  type TBaseApiProps,
  type TPathToOperations,
} from '../api.types';

export class User<
  TPath extends keyof IPathMapTypes,
  TOperations extends TBaseApiProps<TOperations> = TPathToOperations<TPath>,
> extends BaseApi<TOperations> {
  constructor(protected readonly instance: AxiosInstance) {
    super(instance);
  }

  async createUser(data: TOperations['create']['req']) {
    return await this.create({
      url: `/${EPath.users}`,
      data,
    });
  }

  async getUser(userId: string) {
    return await this.get({
      url: `/${EPath.users}/${userId}`,
    });
  }
}

export const createApiUser = () => new User<EPath.users>(instance);
export const apiUser = createApiUser();
