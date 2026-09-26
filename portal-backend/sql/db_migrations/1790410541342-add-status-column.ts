import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusColumn1790410541342 implements MigrationInterface {
  name = 'AddStatusColumn1790410541342';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "image_file" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."image_file_status_enum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "image_file" ADD "status" "public"."image_file_status_enum" NOT NULL DEFAULT 'COMPLETED'`,
    );
    await queryRunner.query(`ALTER TABLE "image_file" ALTER COLUMN "status" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "image_file" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."image_file_status_enum"`);
    await queryRunner.query(`ALTER TABLE "image_file" ADD "status" character varying`);
  }
}
