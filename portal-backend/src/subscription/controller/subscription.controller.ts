import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { GetCurrentUserFromJwt } from '../../app/jwt.decorators';
import { IsAuthorizedUser } from '../../auth/guards/auth.guard';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { SubscriptionService } from '../services/subscription.service';

@ApiTags('Subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @IsAuthorizedUser()
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Returns user subscription details',
  })
  @ApiOkResponse({ description: 'Subscription information were returned' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async getSubscription(@GetCurrentUserFromJwt() username: string) {
    return await this.subscriptionService.getUserSubscriptionInformation(username);
  }

  @Post()
  @IsAuthorizedUser()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create a subscription for user' })
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'Subscription is created' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async createSubscription(
    @Body() dto: CreateSubscriptionDto,
    @GetCurrentUserFromJwt() username: string,
  ) {
    return this.subscriptionService.createSubscription(dto, username);
  }

  @Delete(':id')
  @IsAuthorizedUser()
  @ApiBearerAuth()
  async cancelSubscription(@Param('id') id: string) {
    return this.subscriptionService.cancelSubscription(id);
  }

  @Post('webhook')
  async webhook(@Req() req: Request, @Res() res: Response) {
    try {
      await this.subscriptionService.webhook(req, res);
      res.status(HttpStatus.OK).send();
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Webhook processing failed');
    }
  }
}
