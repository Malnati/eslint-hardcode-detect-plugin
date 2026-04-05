// sspa/mfe-api-helpers/src/interceptors/error.ts
import { AxiosError } from 'axios';
import { notifyUnauthorized } from '@mfe/auth';

export const errorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    notifyUnauthorized();
  }
  return Promise.reject(error);
};
