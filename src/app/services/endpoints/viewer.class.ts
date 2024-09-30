import { type AxiosInstance } from 'axios';

import { BaseApi, instance } from '../api.class';
import {
  EPath,
  type IPathMapTypes,
  type TBaseApiProps,
  type TPathToOperations,
} from '../api.types';

export class Viewer<
  TPath extends keyof IPathMapTypes,
  TOperations extends TBaseApiProps<TOperations> = TPathToOperations<TPath>,
> extends BaseApi<TOperations> {
  constructor(protected readonly instance: AxiosInstance) {
    super(instance);
  }

  async fetchShareLinkData(url: string, data: object) {
    return await this.create({
      url,
      data,
    });
  }

  async getShareLinkData(url: string) {
    return await this.get({
      url,
    });
  }
}

export const createApiViewer = () => new Viewer<EPath.viewer>(instance);
export const apiViewer = createApiViewer();
