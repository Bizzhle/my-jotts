import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntityForPaymentPlan1735429252601 implements MigrationInterface {
    name = 'UpdateEntityForPaymentPlan1735429252601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."invoice_status_enum" RENAME TO "invoice_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."invoice_status_enum" AS ENUM('draft', 'open', 'uncollectible', 'void', 'paid')`);
        await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "status" TYPE "public"."invoice_status_enum" USING "status"::"text"::"public"."invoice_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."invoice_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."invoice_status_enum_old" AS ENUM('paid', 'unpaid', 'past_due', 'incomplete')`);
        await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "status" TYPE "public"."invoice_status_enum_old" USING "status"::"text"::"public"."invoice_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."invoice_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."invoice_status_enum_old" RENAME TO "invoice_status_enum"`);
    }

}
