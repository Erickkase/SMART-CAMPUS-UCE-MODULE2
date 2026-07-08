export interface ElectronAPI {
  getApiBaseUrl: () => string;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
