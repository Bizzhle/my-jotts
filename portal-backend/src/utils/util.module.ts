import { Module } from '@nestjs/common';
import { MailerService } from './services/mailer.services';

@Module({
  imports: [],
  providers: [MailerService],
  exports: [MailerService],
})
export class UtilsModule {}
