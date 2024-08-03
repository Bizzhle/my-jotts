import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdjustUserAccount1722458494829 implements MigrationInterface {
  name = 'AdjustUserAccount1722458494829';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "user_account" SET last_logged_in = CURRENT_TIMESTAMP WHERE last_logged_in IS NULL `,
    );
    await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "first_name" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "last_name" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user_account" ALTER COLUMN "registration_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_account" ALTER COLUMN "last_logged_in" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_account" ALTER COLUMN "last_logged_in" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_account" ALTER COLUMN "registration_date" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "last_name" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "first_name" SET NOT NULL`);
  }
}
