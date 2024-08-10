import { MigrationInterface, QueryRunner } from "typeorm";

export class PasswordResetTokenEntity1723305077578 implements MigrationInterface {
    name = 'PasswordResetTokenEntity1723305077578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pasword-reset-token" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "token" text NOT NULL, "session_start" TIMESTAMP NOT NULL, "expiry_date" TIMESTAMP NOT NULL, CONSTRAINT "UQ_ad446cba797b67726848a447739" UNIQUE ("token"), CONSTRAINT "PK_9bdc3793f1e82e9497adb13b449" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pasword-reset-token" ADD CONSTRAINT "pasword-reset-token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pasword-reset-token" DROP CONSTRAINT "pasword-reset-token_user_id_fkey"`);
        await queryRunner.query(`DROP TABLE "pasword-reset-token"`);
    }

}
