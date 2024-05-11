import { MigrationInterface, QueryRunner } from "typeorm";

export class EntityToStoreImageUploadData1714763894488 implements MigrationInterface {
    name = 'EntityToStoreImageUploadData1714763894488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image_file" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "key" character varying NOT NULL, "activity_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_a63c149156c13fef954c6f56398" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "imageFile_url" character varying`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "image_file" ADD CONSTRAINT "image_file_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image_file" ADD CONSTRAINT "image_file_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image_file" DROP CONSTRAINT "image_file_user_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "image_file" DROP CONSTRAINT "image_file_activity_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "imageFile_url"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "image" character varying`);
        await queryRunner.query(`DROP TABLE "image_file"`);
    }

}
