import { Module } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import { join, resolve } from 'path';
import 'reflect-metadata';
import { Account } from 'src/users/entities/Account.entity';
import { Session } from 'src/users/entities/Session.entity';
import { User } from 'src/users/entities/User.entity';
import { Verification } from 'src/users/entities/Verification';
import { DataSource } from 'typeorm';
import { EnvironmentConfigRootModule } from '../src/app/configuration/Environment';
import { TypeOrmRootModule } from '../src/app/configuration/TypeORM';

@Module({
  imports: [EnvironmentConfigRootModule(), TypeOrmRootModule(true)],
})
export class DatasourceModule {}

dotenvConfig({ path: resolve(__dirname, '../../.env') });

const url = new URL(process.env.DATABASE_URL!);
const database = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: url.hostname,
  port: +url.port,
  username: url.username,
  password: url.password,
  database: database,
  synchronize: false,
  logging: process.env.DATABASE_LOG_QUERIES === 'true',
  connectTimeoutMS: 60000,
  // namingStrategy: new CustomNamingStrategy(),
  entities: [User, Account, Verification, Session, join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'sql/db_migrations/**/*{.ts,.js}')],
  ssl: process.env.DATABASE_USE_SSL === 'true',
});
