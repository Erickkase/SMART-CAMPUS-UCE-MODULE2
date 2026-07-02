import axios from 'axios';

const createHttpClient = (baseURL: string) =>
  axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const scholarshipApi = createHttpClient(
  process.env.NEXT_PUBLIC_SCHOLARSHIP_API_URL ?? 'http://localhost:3000',
);

export const socioeconomicApi = createHttpClient(
  process.env.NEXT_PUBLIC_SOCIOECONOMIC_API_URL ?? 'http://localhost:3001',
);

export const psychologicalApi = createHttpClient(
  process.env.NEXT_PUBLIC_PSYCHOLOGICAL_API_URL ?? 'http://localhost:3002',
);

export const gatewayApi = createHttpClient(
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? 'http://localhost:8080',
);
