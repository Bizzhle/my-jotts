import {
  ClassSerializerInterceptor,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ActivityModule } from 'src/activity/activity.module';
import { CategoryModule } from 'src/category/category.module';
import { UsersModule } from 'src/users/users.module';
import { LogsMiddleware } from '../logger/middlewares/log.middleware';
import { LogsModule } from '../logger/logs.module';
import { UploadModule } from '../upload/upload.module';
import { ExcludeNullInterceptor } from '../utils/exclude-null.interceptor';
import { EnvironmentConfigRootModule } from './configuration/Environment';
import { TypeOrmRootModule } from './configuration/TypeORM';
import { ExceptionsFilter } from './exceptions.filter';
import { RequestContextMiddleware } from './middleware/request-context.middleware';
import { ImageModule } from '../image/image.module';
import { RolesGuard } from '../users/guards/role.guard';
import { JwtModule } from '@nestjs/jwt';
import { CertificateModule } from '../certificates/certificate.module';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/util.module';

@Module({
  imports: [
    EnvironmentConfigRootModule(),
    TypeOrmRootModule(),
    UsersModule,
    ActivityModule,
    CategoryModule,
    UploadModule,
    LogsModule,
    ImageModule,
    JwtModule.register({
      global: true,
    }),
    CertificateModule,
    AuthModule,
    UtilsModule,
  ],
  providers: [
    // RequestContextMiddleware,
    Logger,

    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExcludeNullInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
    // consumer.apply(AuthVerifierMiddleWare).forRoutes('*');
  }
}
