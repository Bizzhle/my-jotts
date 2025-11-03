import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToUser1761161569098 implements MigrationInterface {
    name = 'AddRoleToUser1761161569098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" text NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}
