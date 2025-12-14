import { Body, Controller, Post } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SupportRequestDto } from './dto/support-request.dto';
import { SupportRequestService } from './support.service';

@ApiTags('Support')
@Controller('support')
export class SupportController {
  constructor(private readonly supportRequestService: SupportRequestService) {}

  @Post('request')
  @ApiOkResponse({ description: 'Support request submitted successfully' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async submitSupportRequest(@Body() supportRequestDto: SupportRequestDto): Promise<void> {
    return this.supportRequestService.submitSupportRequest(supportRequestDto);
  }
}
