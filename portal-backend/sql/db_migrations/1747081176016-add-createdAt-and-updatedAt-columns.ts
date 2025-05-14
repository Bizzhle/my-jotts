import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtAndUpdatedAtColumns1747081176016 implements MigrationInterface {
  name = 'AddCreatedAtAndUpdatedAtColumns1747081176016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" ADD "createdAt" date`);
    await queryRunner.query(`ALTER TABLE "category" ADD "updatedAt" date`);
    await queryRunner.query(`UPDATE "category" SET "createdAt" = NOW(), "updatedAt" = NOW()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "category" SET "createdAt" = NULL, "updatedAt" = NULL`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "createdAt"`);
  }
}
