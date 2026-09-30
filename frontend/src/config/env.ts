import { Envvars } from "./envvars";

declare global {
  interface Window {
    env: Envvars;
  }
}

export const env: Envvars = import.meta.env.PROD
  ? window.env
  : {
      REACT_APP_API_URL: import.meta.env.REACT_APP_API_URL as string,
      REACT_APP_API_STRIPE_PUBLISHABLE_KEY: import.meta.env
        .REACT_APP_API_STRIPE_PUBLISHABLE_KEY as string,
      REACT_APP_CONTACT_EMAIL: import.meta.env.REACT_APP_CONTACT_EMAIL as string,
      REACT_APP_API_DOMAIN: import.meta.env.REACT_APP_API_DOMAIN as string,
    };
