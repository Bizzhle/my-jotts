import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStripeProductItToPaymentPlan1735673294028 implements MigrationInterface {
  name = 'AddStripeProductItToPaymentPlan1735673294028';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment_plan" ADD "stripeProductId" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment_plan" DROP COLUMN "stripeProductId"`);
  }
}
