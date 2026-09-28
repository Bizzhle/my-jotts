import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVars } from '../envvars';
import { QueueName } from './constants/queue.constants';
import { DeadLetterService } from './dead-letter.service';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvVars>) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: Number(configService.get<string>('REDIS_PORT', '6379')),
          ...(configService.get<string>('REDIS_PASSWORD') && {
            password: configService.get<string>('REDIS_PASSWORD'),
          }),
        },
      }),
    }),
    BullModule.registerQueue(
      { name: QueueName.EMAIL },
      { name: QueueName.IMAGE_PROCESSING },
      { name: QueueName.DEAD_LETTER },
    ),
  ],
  providers: [DeadLetterService],
  exports: [BullModule, DeadLetterService],
})
export class QueueModule {}
