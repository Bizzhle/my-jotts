import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IsAuthorizedUser } from '../../auth/guards/auth.guard';
import { CreatePaymentPlanDto } from '../dtos/payment-plan.dto';
import { PaymentPlan } from '../entities/payment-plan.entity';
import { PaymentPlanService } from '../services/payment-plan.service';

@ApiTags('Payment Plan')
@Controller('payment-plan')
export class PaymentPlanController {
  constructor(private paymentPlanService: PaymentPlanService) {}

  @Get()
  @IsAuthorizedUser()
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Gets all active payment plans',
  })
  @ApiOkResponse({ description: 'Payment plans were returned' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async getActivePlans(): Promise<PaymentPlan[]> {
    return await this.paymentPlanService.getAllActivePlans();
  }

  @Get(':id')
  @IsAuthorizedUser()
  @ApiBearerAuth()
  async getPlan(@Param('id') id: number) {
    return this.paymentPlanService.getPlanById(id);
  }

  @Post()
  @IsAuthorizedUser()
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Create an active payment plan',
  })
  @ApiBody({ type: CreatePaymentPlanDto })
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'Payment plan is created' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async createPaymentPlan(@Body() dto: CreatePaymentPlanDto) {
    return await this.paymentPlanService.createPlan(dto);
  }

  @Put(':id')
  @IsAuthorizedUser()
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Update an active payment plan.',
  })
  @ApiBody({ type: CreatePaymentPlanDto })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Payment plan is updated' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async updatePlan(@Param('id') id: number, @Body() dto: CreatePaymentPlanDto) {
    return this.paymentPlanService.updatePlan(id, dto);
  }

  @Delete(':id')
  @IsAuthorizedUser()
  @ApiBearerAuth()
  async deactivatePlan(@Param('id') id: number) {
    return this.paymentPlanService.deactivatePlan(id);
  }
}
