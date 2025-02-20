import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEntityForSubscriptionInvoice1735425877952 implements MigrationInterface {
  name = 'CreateEntityForSubscriptionInvoice1735425877952';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."invoice_status_enum" AS ENUM('paid', 'unpaid', 'past_due', 'incomplete')`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice" ("id" SERIAL NOT NULL, "stripeInvoiceId" character varying NOT NULL, "amountDue" numeric(10,2) NOT NULL, "amountPaid" numeric(10,2) NOT NULL, "currency" character varying NOT NULL, "status" "public"."invoice_status_enum" NOT NULL, "billingReason" character varying NOT NULL, "paidAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "dueDate" TIMESTAMP, "subscriptionId" integer, "userId" integer, CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "invoice_userId_fkey"`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "invoice_subscriptionId_fkey"`);
    await queryRunner.query(`DROP TABLE "invoice"`);
    await queryRunner.query(`DROP TYPE "public"."invoice_status_enum"`);
  }
}
