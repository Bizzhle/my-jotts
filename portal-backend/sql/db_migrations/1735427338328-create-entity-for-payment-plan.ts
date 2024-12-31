import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEntityForPaymentPlan1735427338328 implements MigrationInterface {
  name = 'CreateEntityForPaymentPlan1735427338328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."payment_plan_name_enum" AS ENUM('BASIC', 'PRO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_plan" ("id" SERIAL NOT NULL, "name" "public"."payment_plan_name_enum" NOT NULL, "description" character varying, "stripePriceId" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "currency" character varying NOT NULL, "billingInterval" character varying NOT NULL, "features" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_db12dcbce4ef547fa9879a0aca0" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment_plan"`);
    await queryRunner.query(`DROP TYPE "public"."payment_plan_name_enum"`);
  }
}
