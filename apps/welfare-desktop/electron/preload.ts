import { contextBridge } from 'electron';

const API_BASE = `http://localhost:${process.env.EXPRESS_PORT || 3099}`;

contextBridge.exposeInMainWorld('electronAPI', {
  getApiBaseUrl: () => API_BASE,
});
