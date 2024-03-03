import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1708977582583 implements MigrationInterface {
    name = 'CreateTables1708977582583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "title" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "category_id" integer NOT NULL, "price" integer, "location" character varying, "rating" integer, "content" character varying, "image" character varying, "date_created" date, "date_updated" date, "user_id" integer NOT NULL, "categoryId" integer, CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_account" ("id" SERIAL NOT NULL, "email_address" character varying NOT NULL, "password" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "enabled" boolean, "registration_date" TIMESTAMP, "last_logged_in" TIMESTAMP, CONSTRAINT "UQ_e26ea5996ca4379322890f77b24" UNIQUE ("email_address"), CONSTRAINT "PK_6acfec7285fdf9f463462de3e9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" integer, "session_start" TIMESTAMP, "session_end" TIMESTAMP, "access_token" uuid, "refresh_token" uuid, "refresh_token_expiration_time" TIMESTAMP, "session_id" uuid, "hashed_at" text, CONSTRAINT "UQ_2eb74e2fc4d76516761bf63b830" UNIQUE ("access_token"), CONSTRAINT "UQ_0ac42018737161d3f60307170e5" UNIQUE ("refresh_token"), CONSTRAINT "UQ_c593eaca81fe9ffe08ae6ffd249" UNIQUE ("refresh_token_expiration_time"), CONSTRAINT "UQ_50c2b6e58a37166dab435111f25" UNIQUE ("session_id"), CONSTRAINT "UQ_001a7bd4b59f3391508669f9868" UNIQUE ("hashed_at"), CONSTRAINT "PK_adf3b49590842ac3cf54cac451a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "name" character varying(128) NOT NULL, "description" character varying, CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying(128) NOT NULL, "description" character varying, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permission" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_19a94c31d4960ded0dcd0397759" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3d0a7155eafd75ddba5a701336" ON "role_permission" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e3a3ba47b7ca00fd23be4ebd6c" ON "role_permission" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "activity_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_permission_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_role_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "user_session" DROP CONSTRAINT "user_session_user_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "activity_user_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "activity_categoryId_fkey"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "category_user_id_fkey"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e3a3ba47b7ca00fd23be4ebd6c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d0a7155eafd75ddba5a701336"`);
        await queryRunner.query(`DROP TABLE "role_permission"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "user_session"`);
        await queryRunner.query(`DROP TABLE "user_account"`);
        await queryRunner.query(`DROP TABLE "activity"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
