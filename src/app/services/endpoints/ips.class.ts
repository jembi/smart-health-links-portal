import { type AxiosInstance } from 'axios';

import { BaseApi, instance } from '../api.class';
import {
  EPath,
  type IPathMapTypes,
  type TBaseApiProps,
  type TPathToOperations,
} from '../api.types';

export class Ips<
  TPath extends keyof IPathMapTypes,
  TOperations extends TBaseApiProps<TOperations> = TPathToOperations<TPath>,
> extends BaseApi<TOperations> {
  constructor(protected readonly instance: AxiosInstance) {
    super(instance);
  }

  async getPatientData(userId: string) {
    return await this.get({
      url: `/${EPath.users}/${userId}/${EPath.ips}`,
    });
  }
}

export const createApiIps = () => new Ips<EPath.ips>(instance);
export const apiIps = createApiIps();
