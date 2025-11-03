import { Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import { MigrationInterface, QueryRunner } from 'typeorm';

type Constructor = new (...args: any[]) => any;

export function DevMigration<T extends Constructor>(constructorFunc: T): T {
  const logger = new Logger();
  return class extends constructorFunc implements MigrationInterface {
    public name: string = constructorFunc.name;

    constructor(...args: any[]) {
      super(...args);
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
      if (process.env.DATABASE_RUN_DEV_MIGRATIONS === 'true') {
        logger.log(`Running dev-migration "${this.name || constructorFunc.name}"`);
        return super.up(queryRunner);
      } else {
        logger.log(`Skipping dev-migration "${this.name || constructorFunc.name}"`);
      }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      if (process.env.DATABASE_RUN_DEV_MIGRATIONS === 'true') {
        return super.down(queryRunner);
      } else {
        logger.log(`Skipping dev-migration "${this.name || constructorFunc.name}"`);
      }
    }
  };
}

export class UpdateMigration implements MigrationInterface {
  readonly logger: Logger = new Logger();

  constructor(readonly version: number, readonly filename: string) {}
  name?: string;
  transaction?: boolean;
  down(queryRunner: QueryRunner): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const versions = await queryRunner.query(
      "SELECT value FROM config WHERE key='db_schema_version'",
    );
    if (versions.length !== 1) {
      throw new Error('Invalid number');
    }
    const schemaVersion = versions[0].value;
    const updateFile = `sql/updates/${this.filename}`;

    // check if config table declares that update has ran previously
    if (schemaVersion >= this.version) {
      //migration will run but make no changes to database
      this.logger.log(`Skipping legacy update`);
      return;
    }

    this.logger.log(`Running legacy update "${updateFile}"`);
    const updateScript = await fs.readFile(updateFile);
    await queryRunner.query(updateScript.toString())
  }
}
