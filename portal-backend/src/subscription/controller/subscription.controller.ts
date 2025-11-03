import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from '../services/subscription.service';

@ApiTags('Subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // @Get()
  // @IsAuthorizedUser()
  // @ApiOperation({
  //   description: 'Returns user subscription details',
  // })
  // @ApiOkResponse({ description: 'Subscription information were returned' })
  // @ApiNotFoundResponse({ description: 'User not found' })
  // @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  // @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  // async getSubscription(@Req() req: Request) {
  //   return await this.subscriptionService.getUserSubscriptionOfUser(req.headers);
  // }

  // @Post()
  // @IsAuthorizedUser()
  // @ApiOperation({ description: 'Create a subscription for user' })
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOkResponse({ description: 'Subscription is created' })
  // @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  // async createSubscription(
  //   @Body() dto: CreateSubscriptionDto,
  //   @GetCurrentUserEmail() username: string,
  // ) {
  //   return this.subscriptionService.createSubscription(dto, username);
  // }

  // @Delete(':id')
  // @IsAuthorizedUser()
  // async cancelSubscription(@Param('id') id: string) {
  //   return this.subscriptionService.cancelSubscription(id);
  // }

  // @Post('webhook')
  // async webhook(@Req() req: Request, @Res() res: Response) {
  //   try {
  //     await this.subscriptionService.webhook(req, res);
  //     res.status(HttpStatus.OK).send();
  //   } catch (error) {
  //     console.error('Webhook error:', error);
  //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Webhook processing failed');
  //   }
  // }
}
