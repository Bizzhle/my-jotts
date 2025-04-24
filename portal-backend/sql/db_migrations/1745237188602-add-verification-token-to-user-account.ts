import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerificationTokenToUserAccount1745237188602 implements MigrationInterface {
    name = 'AddVerificationTokenToUserAccount1745237188602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" ADD "verification_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "verification_token"`);
    }

}
