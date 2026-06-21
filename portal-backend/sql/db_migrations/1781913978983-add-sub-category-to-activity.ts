import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubCategoryToActivity1781913978983 implements MigrationInterface {
  name = 'AddSubCategoryToActivity1781913978983';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activity" ADD "sub_category_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "activity" ADD CONSTRAINT "FK_59430f4696c23ad1ad269af0518" FOREIGN KEY ("sub_category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Update sub_category_id only if the record exists
    const result = await queryRunner.query(`
        SELECT id FROM activity WHERE category_id = 1 AND id = 1 LIMIT 1`);
    if (result.length > 0) {
      await queryRunner.query(`
        UPDATE activity SET sub_category_id = 2 WHERE category_id = 1 AND id = 1`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activity" DROP CONSTRAINT "FK_59430f4696c23ad1ad269af0518"`,
    );
    await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "sub_category_id"`);
  }
}
