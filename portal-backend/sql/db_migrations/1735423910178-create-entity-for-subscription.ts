import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEntityForSubscription1735423910178 implements MigrationInterface {
  name = 'CreateEntityForSubscription1735423910178';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."subscription_status_enum" AS ENUM('active', 'canceled', 'past_due', 'unpaid', 'incomplete')`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "stripeSubscriptionId" character varying NOT NULL, "stripeCustomerId" character varying NOT NULL, "user_id" integer NOT NULL, "status" "public"."subscription_status_enum" NOT NULL, "currentPeriodStart" TIMESTAMP, "currentPeriodEnd" TIMESTAMP, "priceId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "subscription_user_id_fkey"`,
    );
    await queryRunner.query(`DROP TABLE "subscription"`);
    await queryRunner.query(`DROP TYPE "public"."subscription_status_enum"`);
  }
}
