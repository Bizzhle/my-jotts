import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FoodModule } from 'src/food/food.module';
import { RecipeModule } from 'src/recipe/recipe.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { EnvironmentConfigRootModule } from './configuration/Environment';
import { TypeOrmRootModule } from './configuration/TypeORM';
import { AppService } from './service/app.service';

@Module({
  imports: [
    EnvironmentConfigRootModule(),
    TypeOrmRootModule(),
    UsersModule,
    FoodModule,
    RestaurantModule,
    RecipeModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
