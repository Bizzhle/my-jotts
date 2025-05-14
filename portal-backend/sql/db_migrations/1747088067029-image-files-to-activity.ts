import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImageFilesToActivity1747088067029 implements MigrationInterface {
  name = 'ImageFilesToActivity1747088067029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image_file" DROP CONSTRAINT "image_file_activity_id_fkey"`,
    );
    await queryRunner.query(`ALTER TABLE "image_file" ADD "activityId" integer`);
    await queryRunner.query(
      `ALTER TABLE "image_file" ADD CONSTRAINT "image_file_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image_file" DROP CONSTRAINT "image_file_activityId_fkey"`,
    );
    await queryRunner.query(`ALTER TABLE "image_file" DROP COLUMN "activityId"`);
    await queryRunner.query(
      `ALTER TABLE "image_file" ADD CONSTRAINT "image_file_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
