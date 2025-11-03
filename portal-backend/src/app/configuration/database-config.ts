import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  public readonly runDevMigrations: boolean;
  public readonly runMigrations: boolean;
  public readonly logQueries: boolean;
  public readonly useSsl: boolean;
  public readonly url: URL;

  constructor(private readonly configService: ConfigService) {
    this.runDevMigrations = this.parseBoolean('DATABASE_RUN_DEV_MIGRATIONS', false);
    this.runMigrations = this.parseBoolean('DATABASE_RUN_MIGRATIONS', false);
    this.logQueries = this.parseBoolean('DATABASE_LOG_QUERIES', false);
    this.useSsl = this.parseBoolean('DATABASE_USE_SSL', false);

    const urlString = this.configService.get<string>('DATABASE_URL');
    if (!urlString) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    this.url = new URL(urlString);
  }

  private parseBoolean(key: string, defaultValue = false): boolean {
    const value = this.configService.get<string>(key);
    if (value === undefined || value === null) {
      return defaultValue;
    }
    return /^(yes|true|on|1)$/i.test(value);
  }
}
