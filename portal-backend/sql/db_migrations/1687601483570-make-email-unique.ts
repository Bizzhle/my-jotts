import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeEmailUnique1687601483570 implements MigrationInterface {
    name = 'MakeEmailUnique1687601483570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" ADD CONSTRAINT "UQ_e26ea5996ca4379322890f77b24" UNIQUE ("email_address")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" DROP CONSTRAINT "UQ_e26ea5996ca4379322890f77b24"`);
    }

}
