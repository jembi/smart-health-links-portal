import { type AxiosInstance } from 'axios';

import { BaseApi, instance } from '../api.class';
import {
  EPath,
  type IPathMapTypes,
  type TBaseApiProps,
  type TPathToOperations,
} from '../api.types';

export class QrCode<
  TPath extends keyof IPathMapTypes,
  TOperations extends TBaseApiProps<TOperations> = TPathToOperations<TPath>,
> extends BaseApi<TOperations> {
  constructor(protected readonly instance: AxiosInstance) {
    super(instance);
  }

  async getQrCode(linkId: string, data: TOperations['create']['req']) {
    return await this.create({
      url: `/${EPath.shareLinks}/${linkId}/qrcode`,
      data,
      config: {
        responseType: 'arraybuffer',
      },
    });
  }
}

export const createApiQrCode = () => new QrCode<EPath.qrCode>(instance);
export const apiQrCode = createApiQrCode();
