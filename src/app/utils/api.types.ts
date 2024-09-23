import { type AxiosRequestConfig } from 'axios';

export interface IApiProps {
  url: string;
  data: object;
  params?: AxiosRequestConfig<any>;
}

export enum EEndpoint {
  'shareLinks' = 'share-links',
}
