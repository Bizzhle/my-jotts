const FRONTEND_URL = process.env.FRONTEND_DOMAIN_URL;
const BACKEND_URL = process.env.BACKEND_DOMAIN_URL;
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;

export const trustedOrigins = [FRONTEND_URL, BACKEND_URL, BETTER_AUTH_URL].filter(
  (url): url is string => !!url && /^https?:\/\//.test(url),
);
