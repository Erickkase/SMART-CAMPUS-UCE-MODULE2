/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXPRESS_PORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
