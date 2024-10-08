import { type AxiosRequestConfig } from 'axios';

import type {
  SHLinkDto,
  SHLinkMiniDto,
  CreateSHLinkDto,
  SHLinkRequestDto,
} from '@/domain/dtos/shlink';
import type {
  SHLinkEndpointDto,
  CreateSHLinkEndpointDto,
} from '@/domain/dtos/shlink-endpoint';
import { SHLinkQRCodeRequestDto } from '@/domain/dtos/shlink-qrcode';
import { CreateUserDto, UserDto } from '@/domain/dtos/user';
import { type TBundle } from '@/types/fhir.types';

export interface IApi {
  url: string;
  config?: AxiosRequestConfig<any>;
}

export interface IApiWithPayload<T> extends IApi {
  data?: T;
}

export enum EPath {
  endpoints = 'endpoints',
  ips = 'ips',
  qrCode = 'qrCode',
  shareLinks = 'share-links',
  users = 'users',
  viewer = 'viewer',
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
  [EPath.endpoints]: {
    create: {
      req: CreateSHLinkEndpointDto;
      res: SHLinkEndpointDto;
    };
    read: never;
    update: never;
    delete: never;
  };
  [EPath.ips]: {
    create: {
      req: never;
      res: never;
    };
    read: TBundle;
    update: never;
    delete: never;
  };
  [EPath.qrCode]: {
    create: {
      req: SHLinkQRCodeRequestDto;
      res: never;
    };
    read: never;
    update: never;
    delete: never;
  };
  [EPath.shareLinks]: {
    create: {
      req: Omit<CreateSHLinkDto, 'configExp'> & { configExp?: string };
      res: SHLinkDto;
    };
    read: SHLinkMiniDto;
    update: never;
    delete: never;
  };
  [EPath.users]: {
    create: {
      req: CreateUserDto;
      res: UserDto;
    };
    read: UserDto;
    update: never;
    delete: never;
  };
  [EPath.viewer]: {
    create: {
      req: SHLinkRequestDto;
      res: SHLinkMiniDto;
    };
    read: TBundle;
    update: never;
    delete: never;
  };
}

export type TPathToOperations<TParam extends keyof IPathMapTypes> =
  IPathMapTypes[TParam];
