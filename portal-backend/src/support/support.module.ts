import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils/util.module';
import { SupportController } from './support.controller';
import { SupportRequestService } from './support.service';

@Module({
  imports: [UtilsModule],
  controllers: [SupportController],
  providers: [SupportRequestService],
})
export class SupportModule {}
