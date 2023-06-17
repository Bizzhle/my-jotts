import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { EnvironmentConfigRootModule } from '../src/app/configuration/Environment';
import { TypeOrmRootModule } from '../src/app/configuration/TypeORM';
import { DataSource } from 'typeorm';

@Module({
  imports: [EnvironmentConfigRootModule(), TypeOrmRootModule(true)],
})
class DatasourceModule {}

export const AppDataSource = new Promise<DataSource>(async (resolve) => {
  const app = await NestFactory.createApplicationContext(DatasourceModule);
  const datasource = app.get(DataSource);

  //close connection as Typeorm does initiliazation by itself
  await datasource.destroy();

  resolve(datasource);
});
