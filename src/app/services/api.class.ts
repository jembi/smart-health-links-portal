import axios, { type AxiosInstance } from 'axios';

import type { IApi, TBaseApiProps, IApiWithPayload } from './api.types';

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export class BaseApi<T extends TBaseApiProps<T>> {
  constructor(protected readonly instance: AxiosInstance) {}

  async create<TC extends T['create']>({
    url,
    data,
    config = {},
  }: IApiWithPayload<TC['req']>) {
    return this.instance.post<TC['res']>(url, data, config);
  }

  async find({ url, config = {} }: IApi) {
    return this.instance.get<T['read'][]>(url, config);
  }

  async get({ url, config = {} }: IApi) {
    return this.instance.get<T['read']>(url, config);
  }

  async update<TU extends T['update']>({
    url,
    data,
    config = {},
  }: IApiWithPayload<TU['req']>) {
    return this.instance.put<TU['res']>(url, data, config);
  }

  async delete({ url, config = {} }: IApi) {
    return this.instance.delete<T['delete']>(url, config);
  }
}

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
