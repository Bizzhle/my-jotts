import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './service/app.service';
import { EnvironmentConfigRootModule } from './configuration/Environment';
import { TypeOrmRootModule } from './configuration/TypeORM';

@Module({
  imports: [EnvironmentConfigRootModule(), TypeOrmRootModule()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
