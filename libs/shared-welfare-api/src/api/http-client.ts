import axios, { AxiosInstance } from 'axios';

export interface HttpClientOptions {
  baseURL: string;
  token?: string;
  timeout?: number;
}

export function createHttpClient(options: HttpClientOptions): AxiosInstance {
  const client = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout ?? 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (options.token) {
    client.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${options.token}`;
      return config;
    });
  }

  return client;
}
