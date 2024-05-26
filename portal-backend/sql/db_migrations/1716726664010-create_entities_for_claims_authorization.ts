import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEntitiesForClaimsAuthorization1716726664010 implements MigrationInterface {
    name = 'CreateEntitiesForClaimsAuthorization1716726664010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_account_role" ("user_account_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_7158d5e5ea307ab10d999a345bc" PRIMARY KEY ("user_account_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9e8c26b174473cbfc9c707aecd" ON "user_account_role" ("user_account_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b4aa9e30f52e19cce26cd96ee9" ON "user_account_role" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_account_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user_account_role" ADD CONSTRAINT "user_account_role_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_account_role" ADD CONSTRAINT "user_account_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account_role" DROP CONSTRAINT "user_account_role_role_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "user_account_role" DROP CONSTRAINT "user_account_role_user_account_id_fkey"`);
        await queryRunner.query(`CREATE TYPE "public"."user_account_role_enum" AS ENUM('User', 'Admin')`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "role" "public"."user_account_role_enum" NOT NULL DEFAULT 'User'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4aa9e30f52e19cce26cd96ee9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e8c26b174473cbfc9c707aecd"`);
        await queryRunner.query(`DROP TABLE "user_account_role"`);
    }

}
