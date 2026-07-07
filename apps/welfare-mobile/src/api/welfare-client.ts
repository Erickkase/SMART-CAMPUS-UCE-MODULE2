import { createHttpClient } from '@smart-campus/shared-welfare-api';
import { getToken } from '../utils/storage';

const gatewayUrl =
  process.env.EXPO_PUBLIC_API_GATEWAY_URL ?? 'http://localhost:8080/api';

export const welfareApi = createHttpClient({ baseURL: gatewayUrl });

welfareApi.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
