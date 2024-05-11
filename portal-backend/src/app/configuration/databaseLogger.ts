import { QueryRunner, Logger as TypeOrmLogger } from 'typeorm';
import { Logger as NestLogger } from '@nestjs/common';

class DatabaseLogger implements TypeOrmLogger {
  private readonly logger = new NestLogger('SQL');

  logQuery(query: string, parameters?: unknown[]) {
    this.logger.log(`${query} -- parameters: ${this.stringifyParameters(parameters)}`);
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: unknown[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.error(
      `${query} -- parameters: ${this.stringifyParameters(parameters)} -- ${error}`,
    );
  }
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.warn(
      `Time: ${time} -- parameters: ${this.stringifyParameters(parameters)} -- ${query}`,
    );
  }
  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.log(message);
  }
  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.log(message);
  }
  log(level: 'log' | 'warn' | 'info', message: any, queryRunner?: QueryRunner) {
    if (level === 'log') {
      return this.logger.log(message);
    }
    if (level === 'info') {
      return this.logger.debug(message);
    }
    if (level === 'warn') {
      return this.logger.warn(message);
    }
  }

  private stringifyParameters(parameters?: unknown[]) {
    try {
      return JSON.stringify(parameters);
    } catch {
      return '';
    }
  }
}

export default DatabaseLogger;
