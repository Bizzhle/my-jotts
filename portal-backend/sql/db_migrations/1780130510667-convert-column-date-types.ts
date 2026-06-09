import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertColumnDateTypes1780130510667 implements MigrationInterface {
  name = 'ConvertColumnDateTypes1780130510667';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "accessTokenExpiresAt" TYPE TIMESTAMP WITH TIME ZONE USING "accessTokenExpiresAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "refreshTokenExpiresAt" TYPE TIMESTAMP WITH TIME ZONE USING "refreshTokenExpiresAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "expiresAt" TYPE TIMESTAMP WITH TIME ZONE USING "expiresAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ALTER COLUMN "expiresAt" TYPE TIMESTAMP WITH TIME ZONE USING "expiresAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt"::timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt"::timestamptz`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verification" ALTER COLUMN "updatedAt" TYPE TIMESTAMP USING "updatedAt"::timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ALTER COLUMN "createdAt" TYPE TIMESTAMP USING "createdAt"::timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ALTER COLUMN "expiresAt" TYPE TIMESTAMP USING "expiresAt"::timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" TYPE DATE USING "updatedAt"::date`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" TYPE DATE USING "createdAt"::date`,
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
  }
}
