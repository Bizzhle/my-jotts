import { MigrationInterface, QueryRunner } from 'typeorm';
import { DevMigration } from '../../../src/typeorm/migration';

@DevMigration
export class InsertPaymentPlan1759491473646 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO payment_plan VALUES
              (1, 'BASIC', 'free', 'price_H5UU1', '0', 'EUR', '', '5 activity entries, 5 categories entries, 1 image upload per activity', true, NOW()),
              (2, 'PRO', 'Everything in Basic', 'price_H5UU2', '4.99', 'EUR', 'month', 'Unlimited activity entries, Unlimited categories entries, 5 image upload per activity', true, NOW())
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM payment_plan WHERE id = 1, 2
    `);
  }
}
