import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSubscriptionEntity1761237527316 implements MigrationInterface {
    name = 'UpdateSubscriptionEntity1761237527316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_1ca5dce89a3293e6b88cd14c0ca"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_d4c430f68d08338f006eae83f76"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "subscriptionId"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "currentPeriodStart"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "currentPeriodEnd"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "paymentPlanId"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "priceId"`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "plan" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "referenceId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "UQ_77e8b7cbc880cb315467c608061" UNIQUE ("referenceId")`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "periodStart" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "periodEnd" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "cancelAtPeriodEnd" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "seats" integer`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "trialStart" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "trialEnd" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "subscriptionId" integer`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_1ca5dce89a3293e6b88cd14c0ca" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_1ca5dce89a3293e6b88cd14c0ca"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "subscriptionId"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "trialEnd"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "trialStart"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "seats"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "cancelAtPeriodEnd"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "periodEnd"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "periodStart"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "UQ_77e8b7cbc880cb315467c608061"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "referenceId"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "plan"`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "priceId" character varying`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "paymentPlanId" integer`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "currentPeriodEnd" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "currentPeriodStart" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "subscriptionId" integer`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_d4c430f68d08338f006eae83f76" FOREIGN KEY ("paymentPlanId") REFERENCES "payment_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_1ca5dce89a3293e6b88cd14c0ca" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
