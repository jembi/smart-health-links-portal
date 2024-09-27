import { type AxiosInstance } from 'axios';

import { BaseApi, instance } from '../api.class';
import {
  EPath,
  type IPathMapTypes,
  type TBaseApiProps,
  type TPathToOperations,
} from '../api.types';

export class ShareLink<
  TPath extends keyof IPathMapTypes,
  TOperations extends TBaseApiProps<TOperations> = TPathToOperations<TPath>,
> extends BaseApi<TOperations> {
  constructor(protected readonly instance: AxiosInstance) {
    super(instance);
  }

  async createLink(data: TOperations['create']['req']) {
    return await this.create({
      url: `/${EPath.shareLinks}`,
      data,
    });
  }

  async findLinks() {
    return await this.find({
      url: `/${EPath.shareLinks}`,
    });
  }

  async deactivateLink(id: string) {
    return await this.delete({ url: `/${EPath.shareLinks}/${id}/deactivate` });
  }
}

export const createApiSharedLink = () =>
  new ShareLink<EPath.shareLinks>(instance);
export const apiSharedLink = createApiSharedLink();
