import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TestDatabase } from './database';
import { testUser, testUserRegistry } from './factories/user-factory';
import { bootStrapApp } from './mock-application';

export const TEST_SESSION_COOKIE_NAME = 'better-auth.session_token';

function parseCookieValue(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;

  const entries = cookieHeader.split(';');
  for (const entry of entries) {
    const [rawName, ...valueParts] = entry.trim().split('=');
    if (rawName !== name) continue;
    return valueParts.join('=');
  }

  return undefined;
}

export function getTestSessionCookie(email: string = testUser.email): string {
  return `${TEST_SESSION_COOKIE_NAME}=e2e-session-${encodeURIComponent(email)}`;
}

function getEmailFromTestSessionCookie(cookieHeader: string | undefined): string | undefined {
  const sessionToken = parseCookieValue(cookieHeader, TEST_SESSION_COOKIE_NAME);
  if (!sessionToken || !sessionToken.startsWith('e2e-session-')) {
    return undefined;
  }

  return decodeURIComponent(sessionToken.slice('e2e-session-'.length));
}

const isDebugSession =
  process.execArgv.some((arg) => arg.includes('--inspect')) ||
  Boolean(process.env['VSCODE_INSPECTOR_OPTIONS']);

jest.setTimeout(120000);

jest.mock('../../src/app/configuration/TypeORM', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { TypeOrmModule } = require('@nestjs/typeorm');

  const rawUrl =
    process.env['DATABASE_URL'] ?? 'postgres://admin:admin@localhost:5432/myjottsdb_e2e';
  const url = new URL(rawUrl);

  return {
    TypeOrmRootModule: () =>
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: url.hostname,
        port: Number(url.port) || 5432,
        username: url.username,
        password: url.password,
        database: url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname,
        synchronize: true,
        dropSchema: true,
        autoLoadEntities: true,
        logging: false,
      }),
  };
});

jest.mock('../../auth', () => ({
  auth: {
    api: {
      signUpEmail: jest.fn(),
      signInEmail: jest.fn(),
      signOut: jest.fn(),
      sendVerificationEmail: jest.fn(),
      requestPasswordReset: jest.fn(),
      resetPassword: jest.fn(),
      verifyEmail: jest.fn(),
      setRole: jest.fn(),
      userHasPermission: jest.fn().mockResolvedValue(true),
      listActiveSubscriptions: jest.fn().mockResolvedValue([]),
    },
  },
}));

jest.mock('@nestjs-cls/transactional', () => ({
  ClsPluginTransactional: jest.fn().mockImplementation(() => ({})),
  Transactional: () => () => ({}),
}));

export let app: INestApplication;
export let db: DataSource;
let testDatabase: TestDatabase;

beforeAll(async () => {
  app = await bootStrapApp();
  db = app.get(DataSource);
  testDatabase = new TestDatabase(db);

  app.use((req, _res, next) => {
    const sessionEmail = getEmailFromTestSessionCookie(req.headers.cookie);

    if (sessionEmail) {
      const requestedEmail =
        (req.headers['x-test-user-email'] as string | undefined) ?? sessionEmail;
      const resolved =
        (requestedEmail && testUserRegistry[requestedEmail]) ?? testUserRegistry[testUser.email];
      req['user'] = resolved;
    }

    next();
  });

  await app.init();
}, 120000);

afterAll(async () => {
  if (testDatabase) {
    await testDatabase.clear();
  }
});

afterAll(async () => {
  if (app) {
    await app.close();
  }

  if (db?.isInitialized) {
    await db.destroy();
  }
}, 120000);
