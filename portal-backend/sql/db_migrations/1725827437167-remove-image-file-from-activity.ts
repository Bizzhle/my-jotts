import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveImageFileFromActivity1725827437167 implements MigrationInterface {
  name = 'RemoveImageFileFromActivity1725827437167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "imageFile_url"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activity" ADD "imageFile_url" character varying`);
  }
}
