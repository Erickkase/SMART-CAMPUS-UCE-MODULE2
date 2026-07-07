import { createHttpClient } from '@smart-campus/shared-welfare-api';

export const scholarshipApi = createHttpClient({
  baseURL: process.env.NEXT_PUBLIC_SCHOLARSHIP_API_URL ?? '/api/scholarships',
});

export const socioeconomicApi = createHttpClient({
  baseURL:
    process.env.NEXT_PUBLIC_SOCIOECONOMIC_API_URL ?? '/api/socioeconomic-forms',
});

export const psychologicalApi = createHttpClient({
  baseURL:
    process.env.NEXT_PUBLIC_PSYCHOLOGICAL_API_URL ?? '/api/psychological-care',
});

export const gatewayApi = createHttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? '/api/gateway',
});
