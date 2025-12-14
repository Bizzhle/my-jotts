import { Injectable } from '@nestjs/common';
import { sendEmail } from '../utils/services/transporter';
import { SupportRequestDto } from './dto/support-request.dto';

@Injectable()
export class SupportRequestService {
  constructor() {}

  async submitSupportRequest(dto: SupportRequestDto): Promise<void> {
    await sendEmail(dto.email, `Support Request: ${dto.subject}`, dto.description);
  }
}
