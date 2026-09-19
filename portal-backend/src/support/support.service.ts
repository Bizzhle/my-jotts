import { Injectable } from '@nestjs/common';
import { MailerService } from '../utils/services/mailer.services';
import { SupportRequestDto } from './dto/support-request.dto';

@Injectable()
export class SupportRequestService {
  constructor(private readonly mailerService: MailerService) {}

  async submitSupportRequest(dto: SupportRequestDto): Promise<void> {
    await this.mailerService.sendSupportRequestEmail(
      dto.email,
      `Support Request: ${dto.subject}`,
      dto.description,
    );
  }
}
