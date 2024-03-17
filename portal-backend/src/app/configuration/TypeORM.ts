import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join, resolve } from 'path';
import { EnvVars } from 'src/envvars';
import { CustomNamingStrategy } from '../../typeorm/custom-foreign-keys-naming-strategy';
import { EnvGetBoolean } from '../decorators/env-get.decorators';

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
}

export function TypeOrmRootModule(cli = false) {
  return TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService<EnvVars>) => {
      const url = new URL(configService.get<string>('DATABASE_URL'));
      const useSsl = configService.get<string>('DATABASE_USE_SSL') === 'true';
      const environmentOptions = cli ? cliOptions() : serverOptions();
      const migrationPath = resolve(__dirname, '../../../sql/db_migrations/*.{js,ts}');
      const devMigration = resolve(__dirname, '../../../sql/db_migrations/dev/*.{js,ts}');
      const runMigrations = configService.get<boolean>('DATABASE_RUN_DEV_MIGRATIONS');

      const result: TypeOrmModuleOptions = {
        type: 'postgres',
        host: url.hostname,
        port: +url.port,
        username: url.username,
        password: url.password,
        database: 'activitystepsdb',
        entities: [join(__dirname, '**', '*.entity.{ts, js}')],
        synchronize: false,
        logging: false,
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
