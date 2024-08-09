import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserSessionEntity1722976648795 implements MigrationInterface {
    name = 'UpdateUserSessionEntity1722976648795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_session" DROP CONSTRAINT "UQ_50c2b6e58a37166dab435111f25"`);
        await queryRunner.query(`ALTER TABLE "user_session" DROP COLUMN "session_id"`);
        await queryRunner.query(`ALTER TABLE "user_session" DROP CONSTRAINT "UQ_001a7bd4b59f3391508669f9868"`);
        await queryRunner.query(`ALTER TABLE "user_session" DROP COLUMN "hashed_at"`);
        await queryRunner.query(`ALTER TABLE "user_session" DROP CONSTRAINT "UQ_2eb74e2fc4d76516761bf63b830"`);
        await queryRunner.query(`ALTER TABLE "user_session" DROP COLUMN "access_token"`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD "access_token" text`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD CONSTRAINT "UQ_2eb74e2fc4d76516761bf63b830" UNIQUE ("access_token")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_session" DROP CONSTRAINT "UQ_2eb74e2fc4d76516761bf63b830"`);
        await queryRunner.query(`ALTER TABLE "user_session" DROP COLUMN "access_token"`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD "access_token" uuid`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD CONSTRAINT "UQ_2eb74e2fc4d76516761bf63b830" UNIQUE ("access_token")`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD "hashed_at" text`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD CONSTRAINT "UQ_001a7bd4b59f3391508669f9868" UNIQUE ("hashed_at")`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD "session_id" uuid`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD CONSTRAINT "UQ_50c2b6e58a37166dab435111f25" UNIQUE ("session_id")`);
    }

}
