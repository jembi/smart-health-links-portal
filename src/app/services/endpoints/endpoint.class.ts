import { type AxiosInstance } from 'axios';

import { BaseApi, instance } from '../api.class';
import {
  EPath,
  type IPathMapTypes,
  type TBaseApiProps,
  type TPathToOperations,
} from '../api.types';

export class Endpoint<
  TPath extends keyof IPathMapTypes,
  TOperations extends TBaseApiProps<TOperations> = TPathToOperations<TPath>,
> extends BaseApi<TOperations> {
  constructor(protected readonly instance: AxiosInstance) {
    super(instance);
  }

  async createEndpoint(linkId: string) {
    return await this.create({
      url: `/${EPath.shareLinks}/${linkId}/${EPath.endpoints}`,
      data: {
        urlPath: '/$summary',
      },
    });
  }
}

export const createApiEndpoint = () => new Endpoint<EPath.endpoints>(instance);
export const apiEndpoint = createApiEndpoint();
