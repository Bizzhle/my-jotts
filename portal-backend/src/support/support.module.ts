import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportRequestService } from './support.service';

@Module({
  imports: [],
  controllers: [SupportController],
  providers: [SupportRequestService],
})
export class SupportModule {}
