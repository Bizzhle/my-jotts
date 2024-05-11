import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTitleInCategoryAndInACtivityEntity1711141545590 implements MigrationInterface {
    name = 'ChangeTitleInCategoryAndInACtivityEntity1711141545590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "activity_categoryId_fkey"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "title" TO "category_name"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "activity_title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "UQ_961ecbe6c85018b74e0bdd144fe" UNIQUE ("activity_title")`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "UQ_9359e3b1d5e90d7a0fbe3b28077" UNIQUE ("category_name")`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "activity_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "activity_category_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "UQ_9359e3b1d5e90d7a0fbe3b28077"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "UQ_961ecbe6c85018b74e0bdd144fe"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "activity_title"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "content" character varying`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "category_name" TO "title"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "activity_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
