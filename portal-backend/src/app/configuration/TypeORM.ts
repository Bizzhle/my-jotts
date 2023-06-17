import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join, resolve } from 'path';
import { EnvVars } from 'src/envvars';

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
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService<EnvVars>) => {
      const url = new URL(configService.get<string>('DATABASE_URL'));
      const useSsl = configService.get<string>('DATABASE_USE_SSL') === 'true';
      const environmentOptions = cli ? cliOptions() : serverOptions();
      const migrationPath = resolve(__dirname, '../../../sql/db_migrations/*.{js,ts}');
      const result: TypeOrmModuleOptions = {
        type: 'postgres',
        host: url.hostname,
        port: +url.port,
        username: url.username,
        password: url.password,
        database: 'activity-steps-db',
        entities: [join(__dirname, '**', '*.entity.{ts, js}')],
        synchronize: false,
        logging: true,
        autoLoadEntities: true,
        connectTimeoutMS: 60000,
        migrations: [migrationPath],
        // ssl: useSsl,
        ...environmentOptions,
      };
      return result;
    },
  });
}
