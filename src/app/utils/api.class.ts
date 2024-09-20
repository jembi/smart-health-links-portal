import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

interface IApiProps {
  url: string;
  data: object;
  params?: AxiosRequestConfig<any>;
}

class Api {
  constructor(protected readonly request: AxiosInstance) {}

  create({ url, data, params = {} }: IApiProps) {
    return this.request.post(url, data, params);
  }

  find({ url, params = {} }: Omit<IApiProps, 'data'>) {
    return this.request.get(url, { params });
  }

  update({ url, data, params = {} }: IApiProps) {
    return this.request.put(url, data, params);
  }

  delete({ url, params = {} }: Omit<IApiProps, 'data'>) {
    return this.request.delete(url, params);
  }
}

export const apiClient = new Api(instance);
