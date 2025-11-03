import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join, resolve } from 'path';
import { CustomNamingStrategy } from '../../typeorm-config/custom-foreign-keys-naming-strategy';
import { EnvironmentConfigRootModule } from './Environment';
import { DatabaseConfig } from './database-config';
import { DatabaseConfigModule } from './databaseConfig.module';

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

export function TypeOrmRootModule(cli = false) {
  return TypeOrmModule.forRootAsync({
    imports: [EnvironmentConfigRootModule(), DatabaseConfigModule],
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
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: false,
        logging: config.logQueries,
        autoLoadEntities: true,
        connectTimeoutMS: 60000,
        namingStrategy: new CustomNamingStrategy(),
        migrations: runMigrations ? [migrationPath, devMigration] : [migrationPath],
        ssl: useSsl,
        ...environmentOptions,
      };
      return result;
    },
  });
}
