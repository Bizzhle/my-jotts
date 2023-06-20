import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './service/app.service';
import { EnvironmentConfigRootModule } from './configuration/Environment';
import { TypeOrmRootModule } from './configuration/TypeORM';
import { UsersModule } from 'src/users/users.module';
import { FoodModule } from 'src/food/food.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { RecipeModule } from 'src/recipe/recipe.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    EnvironmentConfigRootModule(),
    TypeOrmRootModule(),
    UsersModule,
    FoodModule,
    RestaurantModule,
    RecipeModule,
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
