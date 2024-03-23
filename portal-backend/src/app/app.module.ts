import { ClassSerializerInterceptor, Logger, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ActivityModule } from 'src/activity/activity.module';
import { CategoryModule } from 'src/category/category.module';
import { UsersModule } from 'src/users/users.module';
import { LogsModule } from '../logs/module/logs.module';
import { UploadModule } from '../upload/upload.module';
import { EnvironmentConfigRootModule } from './configuration/Environment';
import { TypeOrmRootModule } from './configuration/TypeORM';
import { ExceptionsFilter } from './exceptions.filter';
import { RequestContextMiddleware } from './middleware/request-context.middleware';

@Module({
  imports: [
    EnvironmentConfigRootModule(),
    TypeOrmRootModule(),
    UsersModule,
    ActivityModule,
    CategoryModule,
    UploadModule,
    LogsModule,
  ],
  controllers: [],
  providers: [
    Logger,
    RequestContextMiddleware,
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
