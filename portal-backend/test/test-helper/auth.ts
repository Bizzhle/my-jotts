import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getAuthTokens, getTestApp } from './setupTest';

export const httpRequest = (app: INestApplication) => {
  return request(app.getHttpServer());
};

type Body = Record<string, any>;

const buildAuthedRequest = (chain: request.Test, email?: string, body?: Body): request.Test => {
  if (email) chain = chain.set('x-test-user-email', email);
  if (body !== undefined) chain = chain.send(body);
  return chain;
};

export const withAuth = () => {
  const app = getTestApp();
  const token = getAuthTokens().accessToken;
  return {
    post: (url: string, email?: string, body?: Body) =>
      buildAuthedRequest(
        httpRequest(app).post(url).set('Authorization', `Bearer ${token}`),
        email,
        body,
      ),
    get: (url: string, email?: string) =>
      buildAuthedRequest(httpRequest(app).get(url).set('Authorization', `Bearer ${token}`), email),
    put: (url: string, email?: string, body?: Body) =>
      buildAuthedRequest(
        httpRequest(app).put(url).set('Authorization', `Bearer ${token}`),
        email,
        body,
      ),
    delete: (url: string, email?: string) =>
      buildAuthedRequest(
        httpRequest(app).delete(url).set('Authorization', `Bearer ${token}`),
        email,
      ),
    patch: (url: string, email?: string, body?: Body) =>
      buildAuthedRequest(
        httpRequest(app).patch(url).set('Authorization', `Bearer ${token}`),
        email,
        body,
      ),
  };
};

export interface TestUserCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const createTestUserCredentials = (): TestUserCredentials => ({
  email: `e2e-${Date.now()}@example.com`,
  password: 'TEST_USER_PASSWORD',
  name: 'E2E Test User',
});

export async function signUpAndSignIn(
  app: INestApplication,
  user: TestUserCredentials,
): Promise<AuthTokens> {
  await httpRequest(app)
    .post('/auth/sign-up')
    .send(user)
    .expect((res) => {
      if (res.status !== 201 && res.status !== 409) {
        throw new Error(`Unexpected sign-up status: ${res.status}`);
      }
    });

  const signInResponse = await httpRequest(app)
    .post('/auth/sign-in')
    .send({ email: user.email, password: user.password })
    .expect(201);

  const { token: accessToken, refreshToken } = signInResponse.body ?? {};

  return {
    accessToken,
    refreshToken,
  };
}
