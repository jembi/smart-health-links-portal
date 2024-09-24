import { type AxiosRequestConfig } from 'axios';

import {
  SHLinkDto,
  SHLinkMiniDto,
  CreateSHLinkDto,
} from '@/domain/dtos/shlink';

export interface IApi {
  url: string;
  config?: AxiosRequestConfig<any>;
}

export interface IApiWithPayload<T> extends IApi {
  data?: T;
}

export enum EPath {
  'shareLinks' = 'share-links',
  'users' = 'users',
  'ips' = 'ips',
}

export type TOperation<T extends { req?: unknown; res?: unknown }> = {
  req?: T['req'];
  res?: T['res'];
};

export type TBaseApiProps<
  T extends {
    create: TOperation<T['create']>;
    read?: T['read'];
    update: TOperation<T['update']>;
    delete: T['delete'];
  },
> = {
  create: TOperation<T['create']>;
  read?: T['read'];
  update: TOperation<T['update']>;
  delete: T['delete'];
};

export interface IPathMapTypes {
  [EPath.shareLinks]: {
    create: {
      req: Omit<CreateSHLinkDto, 'configExp'> & { configExp?: string };
      res: SHLinkDto;
    };
    read: SHLinkMiniDto;
    update: never;
    delete: never;
  };
}

export type TPathToOperations<TParam extends keyof IPathMapTypes> =
  IPathMapTypes[TParam];
