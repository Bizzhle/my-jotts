/// <reference types="vite/client" />

interface ImportMetaEnv {
  REACT_APP_API_URL: string;
  REACT_APP_API_STRIPE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
