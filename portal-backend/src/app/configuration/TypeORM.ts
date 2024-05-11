import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join, resolve } from 'path';
import { EnvVars } from 'src/envvars';
import { CustomNamingStrategy } from '../../typeorm/custom-foreign-keys-naming-strategy';
import { EnvGet, EnvGetBoolean } from '../decorators/env-get.decorators';
import DatabaseLogger from './databaseLogger';

function cliOptions() {
  return {
    entities: [resolve(__dirname, '../../**/*.entity.{js,ts}')],
  };
}

function serverOptions() {
  return {
    migrationsRun: process.env['NODE_ENV'] !== 'dist',
  };
}

class DatabaseConfig {
  @EnvGetBoolean('DATABASE_RUN_DEV_MIGRATIONS', false)
  runDevMigrations: boolean;

  @EnvGetBoolean('DATABASE_RUN_MIGRATIONS', false)
  runMigrations: boolean;

  @EnvGetBoolean('DATABASE_LOG_QUERIES')
  logQueries: boolean;

  @EnvGetBoolean('DATABASE_USE_SSL')
  useSsl: boolean;

  @EnvGet('DATABASE_URL', { cast: (url) => new URL(url) })
  url: URL;
}

export function TypeOrmRootModule(cli = false) {
  return TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    extraProviders: [DatabaseConfig],
    inject: [DatabaseConfig],
    useFactory: (config: DatabaseConfig) => {
      const { url, useSsl } = config;
      const environmentOptions = cli ? cliOptions() : serverOptions();
      const database = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
      const migrationPath = resolve(__dirname, '../../../sql/db_migrations/*.{js,ts}');
      const devMigration = resolve(__dirname, '../../../sql/db_migrations/dev/*.{js,ts}');
      const runMigrations = config.runDevMigrations;

      const result: TypeOrmModuleOptions = {
        type: 'postgres',
        // logger: new DatabaseLogger(),
        host: url.hostname,
        port: +url.port,
        username: url.username,
        password: url.password,
        database,
        entities: [join(__dirname, '**', '*.entity.{ts, js}')],
        synchronize: false,
        logging: config.logQueries,
        autoLoadEntities: true,
        connectTimeoutMS: 60000,
        namingStrategy: new CustomNamingStrategy(),
        migrations: runMigrations ? [migrationPath, devMigration] : [migrationPath],
        // ssl: useSsl,
        ...environmentOptions,
      };
      return result;
    },
  });
}
