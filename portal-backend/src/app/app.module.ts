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
import { AuthVerifierMiddleWare } from './middleware/auth-verifier.middleware';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../users/services/user-auth/auth.services';
import { UserSessionService } from '../users/services/user-session/user-session.service';

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
    JwtModule.register({}),
  ],
  controllers: [],
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
    AuthService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(RequestContextMiddleware).forRoutes('*');
    consumer.apply(AuthVerifierMiddleWare).forRoutes('*');
  }
}
