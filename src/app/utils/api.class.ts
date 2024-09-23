import axios, { type AxiosInstance } from 'axios';

import { IApiProps, EEndpoint } from './api.types';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL,
});

class BaseApi {
  constructor(protected readonly instance: AxiosInstance) {}

  create({ url, data, params = {} }: IApiProps) {
    return this.instance.post(url, data, params);
  }

  find({ url, params = {} }: Omit<IApiProps, 'data'>) {
    return this.instance.get(url, { params });
  }

  update({ url, data, params = {} }: IApiProps) {
    return this.instance.put(url, data, params);
  }

  delete({ url, params = {} }: Omit<IApiProps, 'data'>) {
    return this.instance.delete(url, params);
  }
}

export class ApiSHLink extends BaseApi {
  constructor(protected readonly instance: AxiosInstance) {
    super(instance);
  }

  async findLinks() {
    return await this.find({
      url: `/${EEndpoint.shareLinks}`,
    });
  }

  async createLink(data: object) {
    return await this.create({ url: `/${EEndpoint.shareLinks}`, data });
  }
}

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (e.g., 401 Unauthorized)
    return Promise.reject(error);
  },
);

export const createApiSharedLink = () => new ApiSHLink(instance);
export const apiSharedLink = createApiSharedLink();
