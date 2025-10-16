import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAutoUuidForAccount1760430121170 implements MigrationInterface {
    name = 'AddAutoUuidForAccount1760430121170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification" DROP CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "verification" ADD CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "id" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "id" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "verification" DROP CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "id" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification" ADD CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id")`);
    }

}
