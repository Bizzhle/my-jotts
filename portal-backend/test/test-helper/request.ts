import * as request from 'supertest';
import { User } from '../../src/users/entities/User.entity';
import { testUser } from './factories/user-factory';
import { app, getTestSessionCookie } from './setupTest';

const supertest = request as unknown as request.SuperTestStatic;

type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export function withAuth(test: request.Test, email?: User | (string & {}), body = {}) {
  const resolvedEmail = typeof email === 'string' ? email : (email?.email ?? testUser.email);

  return test
    .set('Cookie', getTestSessionCookie(resolvedEmail))
    .set('x-test-user-email', resolvedEmail);
}

export function withBasicAuth(test: request.Test, email: string, password: string) {
  const credentials = Buffer.from(`${email}:${password}`).toString('base64');
  return test.set('authorization', `Basic ${credentials}`);
}

export function getRequest(
  method: RequestMethod,
  url: string,
  headers: Record<string, string> = {},
) {
  return supertest(app.getHttpServer())[method](url).set(headers);
}

export function get(url: string, headers: Record<string, string> = {}) {
  return getRequest('get', url, headers);
}

export function post(url: string, body?: Record<string, any>) {
  return getRequest('post', url).send(body);
}

export function put(url: string, body: Record<string, any> = {}) {
  return getRequest('put', url).send(body);
}

export function patch(url: string, body: Record<string, any> = {}) {
  return getRequest('patch', url).send(body);
}
