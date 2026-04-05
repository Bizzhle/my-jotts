import { INestApplication, RequestMethod, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { DataSource } from 'typeorm';
import { UploadService } from '../../src/upload/service/upload.service';
import { User } from '../../src/users/entities/User.entity';
import { AuthTokens } from './auth';
import { TestDatabase } from './database';

interface TestUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const isDebugSession =
  process.execArgv.some((arg) => arg.includes('--inspect')) ||
  Boolean(process.env['VSCODE_INSPECTOR_OPTIONS']);

jest.setTimeout(isDebugSession ? 60000 : 30000);

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

let app: INestApplication;
let dataSource: DataSource;
let testDatabase: TestDatabase;
let accessToken: string | undefined;
let refreshToken: string | undefined;

const testUser = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'tester@example.com',
  name: 'Test User',
  role: 'user',
};

const testUserRegistry: Record<string, TestUser> = {
  [testUser.email]: {
    id: testUser.id,
    email: testUser.email,
    name: testUser.name,
    role: testUser.role,
  },
};

export function registerTestUser(user: TestUser) {
  testUserRegistry[user.email] = user;
}

beforeAll(
  async () => {
    const { AppModule } = await import('../../src/app/app.module');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UploadService)
      .useValue({
        upload: jest.fn().mockResolvedValue({
          Location: 'https://mock-s3-url.com/file.jpg',
          Key: 'mock-key/file.jpg',
          Bucket: 'mock-bucket',
          ETag: '"mock-etag"',
        }),
        deleteUploadFile: jest.fn().mockResolvedValue(undefined),
        getImageStreamFromS3: jest.fn().mockResolvedValue(null),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1', {
      exclude: [
        { path: 'api/auth', method: RequestMethod.ALL },
        { path: 'api/auth/(.*)', method: RequestMethod.ALL },
      ],
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    app.use((req, _res, next) => {
      const authHeader = req.headers.authorization;

      if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        const requestedEmail = req.headers['x-test-user-email'] as string | undefined;
        const resolved =
          (requestedEmail && testUserRegistry[requestedEmail]) ?? testUserRegistry[testUser.email];
        req['user'] = resolved;
      }

      next();
    });

    await app.init();

    dataSource = app.get(DataSource);
    testDatabase = new TestDatabase(dataSource);

    const existing = await dataSource
      .getRepository(User)
      .findOne({ where: { email: testUser.email } });
    if (!existing) {
      await testDatabase.seedUser({
        id: testUser.id,
        name: testUser.name,
        email: testUser.email,
        role: testUser.role,
      });
    }
  },
  isDebugSession ? 60000 : 30000,
);

afterEach(async () => {
  if (testDatabase) {
    await testDatabase.clear();
  }
});

afterAll(
  async () => {
    accessToken = undefined;
    refreshToken = undefined;

    if (app) {
      await app.close();
    }

    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  },
  isDebugSession ? 60000 : 30000,
);

export function getTestApp(): INestApplication {
  return app;
}

export function getDataSource(): DataSource {
  return dataSource;
}

export function getTestDatabase(): TestDatabase {
  return testDatabase;
}

export function getAuthTokens(): AuthTokens {
  return { accessToken, refreshToken };
}

/**
 * Seeds a user into the database AND registers them in the request middleware
 * so that requests sent with `withAuth(email)` resolve to the correct user.
 * Call from a test's `beforeAll` after the global setup has completed.
 */
export async function seedTestUser(overrides: Partial<User> & { id?: string } = {}): Promise<User> {
  const user = await testDatabase.seedUser(overrides);
  registerTestUser({ id: user.id, email: user.email, role: user.role, name: user.name });
  return user;
}

export async function authenticateTestUser(): Promise<AuthTokens> {
  if (accessToken || refreshToken) {
    return { accessToken, refreshToken };
  }

  accessToken = 'e2e-access-token';
  refreshToken = 'e2e-refresh-token';

  return {
    accessToken,
    refreshToken,
  };
}
