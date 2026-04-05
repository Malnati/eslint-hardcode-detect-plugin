// sspa/mfe-api-helpers/src/interceptors/auth.ts
import { InternalAxiosRequestConfig } from 'axios';
import { getToken } from '@mfe/auth';

export const authInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};
