import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStripeCustomerId1761394211099 implements MigrationInterface {
  name = 'AddStripeCustomerId1761394211099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_1ca5dce89a3293e6b88cd14c0ca"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "subscriptionId"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "stripeCustomerId" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "stripeCustomerId"`);
    await queryRunner.query(`ALTER TABLE "invoice" ADD "subscriptionId" integer`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_1ca5dce89a3293e6b88cd14c0ca" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
