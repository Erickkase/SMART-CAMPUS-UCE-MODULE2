import axios from 'axios';

const EXPRESS_PORT = Number(import.meta.env.VITE_EXPRESS_PORT) || 3099;
const BASE_URL = window.electronAPI
  ? window.electronAPI.getApiBaseUrl()
  : `http://localhost:${EXPRESS_PORT}`;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('welfare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
