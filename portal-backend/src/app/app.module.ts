import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { ClassSerializerInterceptor, Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { ClsModule } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import { auth } from '../../auth';
import { ActivityModule } from '../activity/activity.module';
import { AuthenticationModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { CertificateModule } from '../certificates/certificate.module';
import { ImageModule } from '../image/image.module';
import { LogsModule } from '../logger/logs.module';
import { LogsMiddleware } from '../logger/middlewares/log.middleware';
import { SubscriptionModule } from '../subscription/subscription.module';
import { SupportModule } from '../support/support.module';
import { UploadModule } from '../upload/upload.module';
import { RolesGuard } from '../users/guards/role.guard';
import { UsersModule } from '../users/users.module';
import { ExcludeNullInterceptor } from '../utils/exclude-null.interceptor';
import { UtilsModule } from '../utils/util.module';
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
    ImageModule,
    JwtModule.register({
      global: true,
    }),
    CertificateModule,
    AuthenticationModule,
    UtilsModule,
    SubscriptionModule,
    SupportModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req) =>
          req.headers['x-header-id'] || req.headers['x-request-id'] || crypto.randomUUID(),
      },
      plugins: [
        new ClsPluginTransactional({
          imports: [
            // module in which the database instance is provided
            TypeOrmRootModule(),
          ],
          adapter: new TransactionalAdapterTypeOrm({
            dataSourceToken: DataSource,
          }),
        }),
      ],
    }),
    AuthModule.forRoot({
      auth,
    }),
  ],
  providers: [
    RequestContextMiddleware,
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
    consumer.apply(RequestContextMiddleware, LogsMiddleware).forRoutes('*');
    // consumer.apply(AuthVerifierMiddleWare).forRoutes('*');
  }
}
