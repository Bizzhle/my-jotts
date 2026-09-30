import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableImageFileUrlKey1790410541343 implements MigrationInterface {
  name = 'NullableImageFileUrlKey1790410541343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "image_file" ALTER COLUMN "url" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "image_file" ALTER COLUMN "key" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "image_file" ALTER COLUMN "key" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "image_file" ALTER COLUMN "url" SET NOT NULL`);
  }
}
