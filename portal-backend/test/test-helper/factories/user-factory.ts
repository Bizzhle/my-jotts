import { User } from '../../../src/users/entities/User.entity';
import { TestDatabase } from '../database';
import { db } from '../setupTest';

export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const testUser: TestUser = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'tester@example.com',
  name: 'Test User',
  role: 'user',
};

export const testUserRegistry: Record<string, TestUser> = {
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

/**
 * Seeds a user into the database AND registers them in the request middleware
 * so that requests sent with `withAuth(email)` resolve to the correct user.
 * Call from a test's `beforeAll` after the global setup has completed.
 */
export async function seedTestUser(overrides: Partial<User> & { id?: string } = {}): Promise<User> {
  const testDatabase = new TestDatabase(db);
  const user = await testDatabase.seedUser(overrides);
  registerTestUser({ id: user.id, email: user.email, role: user.role, name: user.name });
  return user;
}
