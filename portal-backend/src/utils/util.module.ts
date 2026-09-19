import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CertificateModule } from '../certificates/certificate.module';
import { QueueName } from '../queue/constants/queue.constants';
import { EmailProcessor } from './services/email.processor';
import { JwtSigningService } from './services/jwt-signing.services';
import { MailerService } from './services/mailer.services';
import { RequestContextService } from './services/request-context.service';

@Module({
  imports: [
    CertificateModule,
    BullModule.registerQueue({
      name: QueueName.EMAIL,
    }),
  ],
  providers: [MailerService, JwtSigningService, RequestContextService, EmailProcessor],
  exports: [MailerService, JwtSigningService, RequestContextService, BullModule],
})
export class UtilsModule {}
