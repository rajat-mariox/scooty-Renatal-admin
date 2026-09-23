/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend base URL, e.g. https://backend.slydomobility.com/v1/api */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
