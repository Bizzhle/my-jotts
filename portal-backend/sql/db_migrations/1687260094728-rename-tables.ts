import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTables1687260094728 implements MigrationInterface {
    name = 'RenameTables1687260094728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" RENAME COLUMN "dateCreated" TO "date_created"`);
        await queryRunner.query(`ALTER TABLE "food" RENAME COLUMN "dateCreated" TO "date_created"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "emailAddress"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "registrationDate"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "firstVisit"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "lastVisit"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "dateCreated"`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "email_address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "first_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "last_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "registration_date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "phone_number" character varying`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "first_visit" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "last_visit" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "date_created" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "date_created"`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "date_created" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "date_created"`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "date_created" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "date_created"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "last_visit"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "first_visit"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "registration_date"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "email_address"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "dateCreated" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "lastVisit" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "firstVisit" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "phoneNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "registrationDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "firstName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "emailAddress" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "food" RENAME COLUMN "date_created" TO "dateCreated"`);
        await queryRunner.query(`ALTER TABLE "recipe" RENAME COLUMN "date_created" TO "dateCreated"`);
    }

}
