import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminUserColumns1780227206064 implements MigrationInterface {
  name = 'AddAdminUserColumns1780227206064';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "banReason" text`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "banExpiresAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "banned"`);
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "banned" boolean DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "banned"`);
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "banned" integer`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "banExpiresAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "banReason"`);
  }
}
