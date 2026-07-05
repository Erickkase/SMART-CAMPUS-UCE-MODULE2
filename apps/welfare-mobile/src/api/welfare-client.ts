import { createHttpClient } from '@smart-campus/shared-welfare-api';

const gatewayUrl =
  process.env.EXPO_PUBLIC_API_GATEWAY_URL ?? 'http://localhost:8080/api';

export const welfareApi = createHttpClient({ baseURL: gatewayUrl });
