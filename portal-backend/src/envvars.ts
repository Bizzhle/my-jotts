export interface EnvVars {
  API_URL: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET_NAME: string;
  AWS_S3_REGION: string;
  DATABASE_LOG_QUERIES;
  DATABASE_RUN_MIGRATIONS: boolean;
  DATABASE_RUN_DEV_MIGRATIONS: boolean;
  DATABASE_USE_SSL: boolean;
  DATABASE_URL: string;
  FRONTEND_URL: string;
  NODE_ENV: string;
  SMTP_HOST: string;
  SMTP_PASS: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
}
