import { MigrationInterface, QueryRunner } from 'typeorm';
import { DevMigration } from '../../../src/typeorm-config/migration';

@DevMigration
export class DummyUserData1708982426528 implements MigrationInterface {
  name = 'DummyUserData1708982426528';
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert sample data into the database
    await queryRunner.query(`
              INSERT INTO user_account VALUES
                (1, 'emilia@activity.com',  '$2a$10$TcZ6UEvvppQilWqhCwrQSeBTavqBxZUAmvy6HHm9Cfg6ikrYNQx0e', 'Emilia', 'TestUser', true, NOW())
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback the inserted sample data
    await queryRunner.query(`
          DELETE FROM user_account WHERE id = 1
      `);
  }
}
