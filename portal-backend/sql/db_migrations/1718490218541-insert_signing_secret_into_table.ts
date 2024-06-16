import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertSigningSecretIntoTable1718490218541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO signing_secret (key, start_date, expiry_date)
            VALUES ('8048206da97e5e209686f101a5139e1171c6f65b11e0e67403da61b2e40f78e9e449f99fd1be806427a90c851d36132952c3cd8835a0f95ea135a7b70617f788', '2024-12-15', '2025-12-15');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM signing_secret WHERE key = '8048206da97e5e209686f101a5139e1171c6f65b11e0e67403da61b2e40f78e9e449f99fd1be806427a90c851d36132952c3cd8835a0f95ea135a7b70617f788' AND start_date = '2024-12-15' AND expiry_date = '2025-12-15';
        `);
  }
}
