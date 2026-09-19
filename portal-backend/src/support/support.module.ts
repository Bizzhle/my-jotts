import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueName } from '../queue/constants/queue.constants';
import { UtilsModule } from '../utils/util.module';
import { SupportController } from './support.controller';
import { SupportRequestService } from './support.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.EMAIL,
    }),
    UtilsModule,
  ],
  controllers: [SupportController],
  providers: [SupportRequestService],
})
export class SupportModule {}
