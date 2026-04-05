import { DataSource } from 'typeorm';
import { Activity } from '../../src/activity/entities/activity.entity';
import { Category } from '../../src/category/entities/category.entity';
import { ImageFile } from '../../src/image/entities/image-file.entity';
import { Invoice } from '../../src/subscription/entities/invoice.entity';
import { PaymentPlan } from '../../src/subscription/entities/payment-plan.entity';
import { Subscription } from '../../src/subscription/entities/subscription.entity';
import { InvoiceStatus } from '../../src/subscription/enum/invoice.enum';
import { PaymentPlanEnum } from '../../src/subscription/enum/payment-plan.enum';
import { SubscriptionStatus } from '../../src/subscription/enum/subscrition.enum';
import { Account } from '../../src/users/entities/Account.entity';
import { Session } from '../../src/users/entities/Session.entity';
import { User } from '../../src/users/entities/User.entity';
import { Verification } from '../../src/users/entities/Verification';

/**
 * Table names owned by the auth system.
 * Preserved between tests by `clear()`; targetable via `clearAuth()` / `clearAll()`.
 *
 * Note: the password-reset-token entity has a typo ("pasword") retained from the
 * original migration – the string below matches the actual table name.
 */
const AUTH_TABLE_NAMES = new Set([
  'user',
  'account',
  'session',
  'verification',
  'pasword_reset_token',
]);

export class TestDatabase {
  constructor(private readonly dataSource: DataSource) {}

  // ---------------------------------------------------------------------------
  // Clear helpers
  // ---------------------------------------------------------------------------

  /** Truncates all business tables while preserving auth tables. Call in afterEach. */
  async clear(): Promise<void> {
    await this._truncate((name) => !AUTH_TABLE_NAMES.has(name));
  }

  /** Truncates only auth-owned tables (user, account, session, verification …). */
  async clearAuth(): Promise<void> {
    await this._truncate((name) => AUTH_TABLE_NAMES.has(name));
  }

  /** Truncates every table – use in afterAll when full isolation is required. */
  async clearAll(): Promise<void> {
    await this._truncate(() => true);
  }

  private async _truncate(filter: (tableName: string) => boolean): Promise<void> {
    const tableNames = this.dataSource.entityMetadatas.map((m) => m.tableName).filter(filter);
    if (tableNames.length === 0) return;
    await this.dataSource.query('SET session_replication_role = replica');
    for (const table of tableNames) {
      await this.dataSource.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
    }
    await this.dataSource.query('SET session_replication_role = DEFAULT');
  }

  // ---------------------------------------------------------------------------
  // Auth entity seeders
  // ---------------------------------------------------------------------------

  async seedUser(overrides: Partial<User> = {}): Promise<User> {
    const repo = this.dataSource.getRepository(User);
    const now = new Date();
    return repo.save(
      repo.create({
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        emailVerified: true,
        image: '',
        createdAt: now,
        updatedAt: now,
        role: 'user',
        stripeCustomerId: '',
        ...overrides,
      }),
    );
  }

  async seedAccount(userId: string, overrides: Partial<Account> = {}): Promise<Account> {
    const repo = this.dataSource.getRepository(Account);
    const now = new Date();
    return repo.save(
      repo.create({
        accountId: userId,
        providerId: 'credential',
        userId,
        createdAt: now,
        updatedAt: now,
        ...overrides,
      }),
    );
  }

  async seedSession(userId: string, overrides: Partial<Session> = {}): Promise<Session> {
    const repo = this.dataSource.getRepository(Session);
    const now = new Date();
    return repo.save(
      repo.create({
        userId,
        token: `test-session-${Date.now()}`,
        expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        createdAt: now,
        updatedAt: now,
        ...overrides,
      }),
    );
  }

  async seedVerification(overrides: Partial<Verification> = {}): Promise<Verification> {
    const repo = this.dataSource.getRepository(Verification);
    const now = new Date();
    return repo.save(
      repo.create({
        identifier: `verify-${Date.now()}@example.com`,
        value: `token-${Date.now()}`,
        expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        createdAt: now,
        updatedAt: now,
        ...overrides,
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Business entity seeders
  // ---------------------------------------------------------------------------

  async seedCategory(user: User, overrides: Partial<Category> = {}): Promise<Category> {
    const repo = this.dataSource.getRepository(Category);
    const now = new Date();
    return repo.save(
      repo.create({
        category_name: `test-category-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        user,
        ...overrides,
      }),
    );
  }

  async seedActivity(
    user: User,
    category: Category,
    overrides: Partial<Activity> = {},
  ): Promise<Activity> {
    const repo = this.dataSource.getRepository(Activity);
    return repo.save(
      repo.create({
        activity_title: `test-activity-${Date.now()}`,
        category_id: category.id,
        category,
        user,
        date_created: new Date(),
        date_updated: new Date(),
        ...overrides,
      }),
    );
  }

  async seedImageFile(
    user: User,
    activity: Activity,
    overrides: Partial<ImageFile> = {},
  ): Promise<ImageFile> {
    const repo = this.dataSource.getRepository(ImageFile);
    return repo.save(
      repo.create({
        url: `https://example.com/test-image-${Date.now()}.jpg`,
        key: `test/test-image-${Date.now()}.jpg`,
        activity_id: activity.id,
        activity,
        user,
        ...overrides,
      }),
    );
  }

  async seedSubscription(overrides: Partial<Subscription> = {}): Promise<Subscription> {
    const repo = this.dataSource.getRepository(Subscription);
    return repo.save(
      repo.create({
        plan: 'basic',
        referenceId: `00000000-0000-0000-0000-${Date.now()}`,
        stripeSubscriptionId: `sub_test_${Date.now()}`,
        stripeCustomerId: `cus_test_${Date.now()}`,
        status: SubscriptionStatus.active,
        ...overrides,
      }),
    );
  }

  async seedInvoice(user: User, overrides: Partial<Invoice> = {}): Promise<Invoice> {
    const repo = this.dataSource.getRepository(Invoice);
    return repo.save(
      repo.create({
        stripeInvoiceId: `in_test_${Date.now()}`,
        amountDue: 0,
        amountPaid: 0,
        currency: 'usd',
        status: InvoiceStatus.paid,
        billingReason: 'subscription_create',
        user,
        ...overrides,
      }),
    );
  }

  async seedPaymentPlan(overrides: Partial<PaymentPlan> = {}): Promise<PaymentPlan> {
    const repo = this.dataSource.getRepository(PaymentPlan);
    return repo.save(
      repo.create({
        name: PaymentPlanEnum.BASIC,
        stripePriceId: `price_test_${Date.now()}`,
        price: 9.99,
        currency: 'usd',
        billingInterval: 'month',
        features: ['10 activities', '10 categories'],
        isActive: true,
        ...overrides,
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Bulk helpers
  // ---------------------------------------------------------------------------

  /**
   * Seeds `count` records of any entity using a factory function.
   * Runs sequentially to avoid unique-constraint races on auto-named fields.
   *
   * @example
   * await db.seedMany(Activity, 5, (i) => ({ activity_title: `item-${i}`, ... }));
   */
  async seedMany<T extends object>(
    entityClass: new () => T,
    count: number,
    factory: (index: number) => Partial<T>,
  ): Promise<T[]> {
    const results: T[] = [];
    for (let i = 0; i < count; i++) {
      const [record] = await this.insert(entityClass, [factory(i)]);
      results.push(record);
    }
    return results;
  }

  /** Generic insert for any entity. */
  async insert<T extends object>(entityClass: new () => T, records: Partial<T>[]): Promise<T[]> {
    const repo = this.dataSource.getRepository(entityClass);
    return repo.save(records.map((r) => repo.create(r as T)));
  }

  getRepository<T extends object>(entityClass: new () => T) {
    return this.dataSource.getRepository(entityClass);
  }
}
