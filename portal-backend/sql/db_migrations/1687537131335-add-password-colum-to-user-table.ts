import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordColumToUserTable1687537131335 implements MigrationInterface {
    name = 'AddPasswordColumToUserTable1687537131335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "password"`);
    }

}
