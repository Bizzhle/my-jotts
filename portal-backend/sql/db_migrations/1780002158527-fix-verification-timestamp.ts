import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixVerificationTimestamp1780002158527 implements MigrationInterface {
  name = 'FixVerificationTimestamp1780002158527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ USING "updatedAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "accessTokenExpiresAt" TYPE TIMESTAMPTZ USING "accessTokenExpiresAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "refreshTokenExpiresAt" TYPE TIMESTAMPTZ USING "refreshTokenExpiresAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ USING "updatedAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "expiresAt" TYPE TIMESTAMPTZ USING "expiresAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ USING "updatedAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ALTER COLUMN "expiresAt" TYPE TIMESTAMPTZ USING "expiresAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ USING "updatedAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ADD CONSTRAINT "UQ_896e5902333fa9991d1733e5ee6" UNIQUE ("identifier")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_896e5902333fa9991d1733e5ee" ON "verification" ("identifier")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_896e5902333fa9991d1733e5ee"`);
    await queryRunner.query(
      `ALTER TABLE "verification" ALTER COLUMN "updatedAt" TYPE DATE USING "updatedAt"::date`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ALTER COLUMN "createdAt" TYPE DATE USING "createdAt"::date`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ALTER COLUMN "expiresAt" TYPE DATE USING "expiresAt"::date`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "updatedAt" TYPE DATE USING "updatedAt"::date`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "createdAt" TYPE DATE USING "createdAt"::date`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "expiresAt" TYPE DATE USING "expiresAt"::date`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "updatedAt" TYPE DATE USING "updatedAt"::date`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "createdAt" TYPE DATE USING "createdAt"::date`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "refreshTokenExpiresAt" TYPE DATE USING "refreshTokenExpiresAt"::date`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "accessTokenExpiresAt" TYPE DATE USING "accessTokenExpiresAt"::date`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" TYPE DATE USING "updatedAt"::date`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" TYPE DATE USING "createdAt"::date`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" DROP CONSTRAINT "UQ_896e5902333fa9991d1733e5ee6"`,
    );
  }
}
