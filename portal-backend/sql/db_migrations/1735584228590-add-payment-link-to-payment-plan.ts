import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentLinkToPaymentPlan1735584228590 implements MigrationInterface {
  name = 'AddPaymentLinkToPaymentPlan1735584228590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment_plan" ADD "link" character varying`);
    await queryRunner.query(`ALTER TABLE "subscription" ADD "paymentPlanId" integer`);
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "subscription_paymentPlanId_fkey" FOREIGN KEY ("paymentPlanId") REFERENCES "payment_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "subscription_paymentPlanId_fkey"`,
    );
    await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "paymentPlanId"`);
    await queryRunner.query(`ALTER TABLE "payment_plan" DROP COLUMN "link"`);
  }
}
