import { Envvars } from "./envvars";

declare global {
  interface Window {
    env: Envvars;
  }
}

export const env: Envvars = import.meta.env.PROD
  ? window.env
  : {
      REACT_APP_API_URL: import.meta.env.VITE_API_URL,
      REACT_APP_AWS_REGION: import.meta.env.VITE_API_APP_AWS_REGION,
      REACT_APP_AWS_ACCESS_KEY_ID: import.meta.env
        .VITE_API_APP_AWS_ACCESS_KEY_ID,
      REACT_APP_AWS_SECRET_ACCESS_KEY: import.meta.env
        .VITE_API_APP_AWS_SECRET_ACCESS_KEY,
      REACT_APP_AWS_S3_BUCKET: import.meta.env.VITE_API_APP_AWS_BUCKET_NAME,
      REACT_APP_STRIPE_PUBLISHABLE_KEY: import.meta.env
        .VITE_API_APP_STRIPE_PUBLISHABLE_KEY,
    };
