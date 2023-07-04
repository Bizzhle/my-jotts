import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserSession0001688322004294 implements MigrationInterface {
    name = 'CreateUserSession0001688322004294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" integer, "session_start" TIMESTAMP, "session_end" TIMESTAMP, "access_token" uuid, "refresh_token" uuid, "refresh_token_expiration_time" TIMESTAMP, "session_id" uuid, "hashed_at" text, CONSTRAINT "UQ_2eb74e2fc4d76516761bf63b830" UNIQUE ("access_token"), CONSTRAINT "UQ_0ac42018737161d3f60307170e5" UNIQUE ("refresh_token"), CONSTRAINT "UQ_c593eaca81fe9ffe08ae6ffd249" UNIQUE ("refresh_token_expiration_time"), CONSTRAINT "UQ_50c2b6e58a37166dab435111f25" UNIQUE ("session_id"), CONSTRAINT "UQ_001a7bd4b59f3391508669f9868" UNIQUE ("hashed_at"), CONSTRAINT "PK_adf3b49590842ac3cf54cac451a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_session" DROP CONSTRAINT "user_session_user_id_fkey"`);
        await queryRunner.query(`DROP TABLE "user_session"`);
    }

}
