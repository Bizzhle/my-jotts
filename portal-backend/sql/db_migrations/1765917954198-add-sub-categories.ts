import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubCategories1765917954198 implements MigrationInterface {
    name = 'AddSubCategories1765917954198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "parent_category_id" integer`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_d6db2bf1b938f69d2ebac5a9de8" FOREIGN KEY ("parent_category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_d6db2bf1b938f69d2ebac5a9de8"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "parent_category_id"`);
    }

}
