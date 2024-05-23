import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCurrentUserFromJwt } from '../../app/jwt.decorators';
import { IsAuthenticatedUser } from '../../users/guards/jwt.auth.guard';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { ActivityService } from '../service/activity.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivityResponseDto } from '../dto/response-dto/activityResponse.dto';
import { Roles } from '../../users/decorators/role.decorator';
import { UserRole } from '../../users/enums/roles.enum';
import { CheckRole } from '../../users/guards/role.guard';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @IsAuthenticatedUser()
  @Post()
  @ApiOperation({
    summary: 'Creates an activity',
    description: 'An activity is created by a user',
  })
  @ApiOkResponse({ status: 201, description: 'The Activity has been successfully created.' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  @UseInterceptors(FileInterceptor('file'))
  async createActivity(
    @GetCurrentUserFromJwt() emailAddress: string,
    @Body() dto: CreateActivityDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|webp)$/i }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.activityService.createActivity(emailAddress, dto, file);
  }

  @IsAuthenticatedUser()
  @Get('activities')
  @Roles(UserRole.USER)
  @CheckRole()
  @ApiOperation({
    description: 'Gets all activities related to a user',
  })
  @ApiOkResponse({ status: 201, description: 'Activities were returned' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async getAllUserActivities(
    @GetCurrentUserFromJwt() emailAddress: string,
  ): Promise<ActivityResponseDto[]> {
    return await this.activityService.getAllUserActivities(emailAddress);
  }

  @IsAuthenticatedUser()
  @Get(':categoryId/category')
  @ApiOperation({
    description: 'Gets activities by category',
  })
  @ApiOkResponse({ status: 201, description: 'Activities were returned' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async getAllUserActivitiesByCategory(
    @Param('categoryId') categoryId: number,
    @GetCurrentUserFromJwt() emailAddress: string,
  ) {
    return this.activityService.getUserActivitiesByCategory(categoryId, emailAddress);
  }

  @IsAuthenticatedUser()
  @ApiNotFoundResponse()
  @ApiOperation({
    description: 'Gets an activity',
  })
  @ApiOkResponse({
    status: 201,
    description: 'The Activity has been successfully returned to use.',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  @Get(':id')
  async getOneUserActivity(@Param('id') id: number, @GetCurrentUserFromJwt() emailAddress: string) {
    return this.activityService.getUserActivity(id, emailAddress);
  }

  @IsAuthenticatedUser()
  @Patch(':id/update')
  @ApiOperation({
    summary: 'Updates an activity',
    description: 'An activity is updated by a user',
  })
  @ApiOkResponse({ status: 201, description: 'The Activity has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  @UseInterceptors(FileInterceptor('file'))
  async updateUserActivity(
    @Param('id') activityId: number,
    @Body() dto: UpdateActivityDto,
    @GetCurrentUserFromJwt() emailAddress: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|webp)$/i }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.activityService.updateActivity(activityId, dto, emailAddress, file);
  }

  @IsAuthenticatedUser()
  @Delete(':id/delete')
  @ApiOperation({
    summary: 'Deletes an activity',
    description: 'An activity is deleted by a user',
  })
  @ApiOkResponse({ status: 201, description: 'The Activity has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  removeUserActivity(
    @Param('id') activityId: number,
    @GetCurrentUserFromJwt() emailAddress: string,
  ) {
    return this.activityService.deleteActivity(activityId, emailAddress);
  }
}
