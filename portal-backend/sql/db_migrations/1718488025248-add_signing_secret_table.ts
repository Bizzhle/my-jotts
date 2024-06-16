import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSigningSecretTable1718488025248 implements MigrationInterface {
  name = 'AddSigningSecretTable1718488025248';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "signing_secret" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "expiry_date" TIMESTAMP NOT NULL, CONSTRAINT "PK_0045145ddac14a538cbe368432c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "signing_secret"`);
  }
}
