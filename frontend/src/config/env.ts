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
      REACT_APP_API_STRIPE_PUBLISHABLE_KEY: import.meta.env
        .VITE_API_STRIPE_PUBLISHABLE_KEY as string,
    };
