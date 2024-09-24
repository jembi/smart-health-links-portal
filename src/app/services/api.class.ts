import axios, { type AxiosResponse, type AxiosInstance } from 'axios';

import {
  type IApi,
  type TOperation,
  type TBaseApiProps,
  type IApiWithPayload,
} from './api.types';

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export class BaseApi<T extends TBaseApiProps<T>> {
  constructor(protected readonly instance: AxiosInstance) {}

  async create<TCreate extends T['create']>({
    url,
    data,
    config = {},
  }: IApiWithPayload<TCreate['req']>): Promise<AxiosResponse<TCreate['res']>> {
    return this.instance.post(url, data, config);
  }

  async find<TRead extends T['read']>({
    url,
    config = {},
  }: IApi): Promise<AxiosResponse<TRead[]>> {
    return this.instance.get(url, config);
  }

  async get<TRead extends T['read']>({
    url,
    config = {},
  }: IApi): Promise<AxiosResponse<TRead>> {
    return this.instance.get(url, config);
  }

  async update<TUpdate extends T['update']>({
    url,
    data,
    config = {},
  }: IApiWithPayload<TOperation<TUpdate>['req']>): Promise<
    AxiosResponse<TOperation<TUpdate>['res']>
  > {
    return this.instance.put(url, data, config);
  }

  async delete<TDelete extends T['delete']>({
    url,
    config = {},
  }: IApi): Promise<AxiosResponse<TDelete>> {
    return this.instance.delete(url, config);
  }
}

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
