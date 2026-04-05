/* eslint-disable no-console */
/**
 * E2E test database reset script.
 *
 * Drops the entire schema, re-synchronises all entities (recreating tables),
 * then seeds the default test users so the suite can start cleanly without
 * having to run the full test bootstrap cycle.
 *
 * Usage:
 *   npm run test:db:reset
 *   task test:db:reset
 */

import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

// Load .env.test before anything else so DATABASE_URL is available
dotenvConfig({ path: resolve(__dirname, '../../.env.test') });

import { Activity } from '../../src/activity/entities/activity.entity';
import { Category } from '../../src/category/entities/category.entity';
import { ImageFile } from '../../src/image/entities/image-file.entity';
import { Invoice } from '../../src/subscription/entities/invoice.entity';
import { PaymentPlan } from '../../src/subscription/entities/payment-plan.entity';
import { Subscription } from '../../src/subscription/entities/subscription.entity';
import { Account } from '../../src/users/entities/Account.entity';
import { Session } from '../../src/users/entities/Session.entity';
import { User } from '../../src/users/entities/User.entity';
import { Verification } from '../../src/users/entities/Verification';

// ---------------------------------------------------------------------------
// Default users seeded after every reset
// ---------------------------------------------------------------------------
const DEFAULT_USERS: Partial<User>[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Test User',
    email: 'tester@example.com',
    emailVerified: true,
    image: '',
    role: 'user',
    stripeCustomerId: '',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Custom Tester',
    email: 'custom-tester@example.com',
    emailVerified: true,
    image: '',
    role: 'customUser',
    stripeCustomerId: '',
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    name: 'Admin User',
    email: 'admin@example.com',
    emailVerified: true,
    image: '',
    role: 'admin',
    stripeCustomerId: '',
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const rawUrl =
    process.env['DATABASE_URL'] ?? 'postgres://admin:admin@localhost:5432/myjottsdb_e2e';
  const url = new URL(rawUrl);
  const database = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;

  console.log(`Resetting test database: ${database} on ${url.hostname}:${url.port || 5432}`);

  const dataSource = new DataSource({
    type: 'postgres',
    host: url.hostname,
    port: Number(url.port) || 5432,
    username: url.username,
    password: url.password,
    database,
    // Drop the full schema on connect, then recreate from entities
    dropSchema: true,
    synchronize: true,
    logging: false,
    entities: [
      User,
      Account,
      Session,
      Verification,
      //   PasswordResetToken,
      Category,
      Activity,
      ImageFile,
      Subscription,
      Invoice,
      PaymentPlan,
    ],
  });

  await dataSource.initialize();
  console.log('Schema dropped and entities synchronised.');

  // Re-seed default test users
  const userRepo = dataSource.getRepository(User);
  const now = new Date();
  for (const user of DEFAULT_USERS) {
    await userRepo.save(userRepo.create({ createdAt: now, updatedAt: now, ...user }));
    console.log(`  Seeded user: ${user.email} (${user.role})`);
  }

  await dataSource.destroy();
  console.log('Done.');
}

main().catch((err) => {
  console.error('test:db:reset failed:', err);
  process.exit(1);
});
