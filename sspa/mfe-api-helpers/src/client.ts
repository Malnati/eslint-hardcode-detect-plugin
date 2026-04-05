// sspa/mfe-api-helpers/src/client.ts
import axios from 'axios';
import { authInterceptor } from './interceptors/auth';
import { errorInterceptor } from './interceptors/error';

const apiClient = axios.create({
  baseURL: '/', // URLs base are defined by constant in constants.ts or passed in config
  timeout: 10000,
});

apiClient.interceptors.request.use(authInterceptor);
apiClient.interceptors.response.use((response) => response, errorInterceptor);

export { apiClient };
