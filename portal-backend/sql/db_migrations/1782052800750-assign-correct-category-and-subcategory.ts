import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignCorrectCategoryAndSubcategory1782052800750 implements MigrationInterface {
  name = 'AssignCorrectCategoryAndSubcategory1782052800750';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update activities where the category has a parent category
    // Set category_id to the parent category and sub_category_id to the current category
    await queryRunner.query(`
      UPDATE activity a
      SET 
        sub_category_id = a.category_id,
        category_id = c.parent_category_id
      FROM category c
      WHERE a.category_id = c.id
        AND c.parent_category_id IS NOT NULL
        AND a.sub_category_id IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert the changes by setting category_id back to sub_category_id
    // and clearing sub_category_id
    await queryRunner.query(`
      UPDATE activity a
      SET 
        category_id = a.sub_category_id,
        sub_category_id = NULL
      FROM category c
      WHERE a.sub_category_id = c.id
        AND c.parent_category_id IS NOT NULL
        AND a.category_id = c.parent_category_id
    `);
  }
}
