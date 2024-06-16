import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToUserEntity1715542725968 implements MigrationInterface {
    name = 'AddRoleToUserEntity1715542725968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_account_role_enum" AS ENUM('User', 'Admin')`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "role" "public"."user_account_role_enum" NOT NULL DEFAULT 'User'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_account_role_enum"`);
    }

}
