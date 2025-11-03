import { hash } from 'bcryptjs';
import { DataSource } from 'typeorm';
import { auth } from '../../auth';
import { AppDataSource } from '../data-source';

export const seedLocalUsers = async () => {
  console.log('Attempting to seed user');

  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    return;
  }

  const ds: DataSource = AppDataSource;
  if (!ds.isInitialized) {
    await ds.initialize();
  }
  console.log('Connected to database:', AppDataSource.options.database);
  const dummyUsers = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Admin User',
      email: 'admin@myjotts.com',
      role: 'admin',
      emailVerified: true,
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Regular User',
      email: 'user@myjotts.com',
      role: 'user',
      emailVerified: true,
    },
  ];
  const passwordHash = await hash('password', 10);

  for (const user of dummyUsers) {
    console.log('Connected to database:', AppDataSource.options.database);
    try {
      const existing = await ds.query(`SELECT * FROM "user" WHERE email = $1`, [user.email]);

      if (existing.length > 0) {
        console.log(`⚠️ User already exists: ${user.email}`);
        continue;
      }

      // Create via BetterAuth so related tables (accounts, sessions) are consistent

      const created = await auth.api.signUpEmail({
        body: {
          email: user.email,
          password: passwordHash,
          name: user.name,
        },
      });

      // Update role using BetterAuth’s internal API
      await auth.api.setRole({
        body: {
          userId: created.user?.id || user.id,
          role: user.role as 'admin' | 'user',
        },
        headers: {},
      });

      // Update emailVerified directly in the database
      await ds.query('UPDATE "user" SET "emailVerified" = $1 WHERE "email" = $2', [
        user.emailVerified,
        user.email,
      ]);

      console.log(`✅ Seeded: ${user.email} (${user.role})`);
    } catch (err: any) {
      console.error(`❌ Error seeding ${user.email}:`, err.message);
    }
  }
};
