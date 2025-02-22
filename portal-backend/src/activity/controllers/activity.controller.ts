import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
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
import { GetCurrentUserFromJwt } from '../../app/jwt.decorators';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { ActivityService } from '../service/activity.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ActivityResponseDto } from '../dto/response-dto/activityResponse.dto';
import { IsAuthorizedUser } from '../../auth/guards/auth.guard';
import { OptionalFileValidationPipe } from '../validator/optional-parse-file';
import { Express } from 'express';
@ApiTags('Activities')
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @IsAuthorizedUser()
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Creates an activity',
    description: 'An activity is created by a user',
  })
  @ApiOkResponse({ status: 201, description: 'The Activity has been successfully created.' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  @UseInterceptors(FilesInterceptor('files', 3))
  async createActivity(
    @GetCurrentUserFromJwt() emailAddress: string,
    @Body() dto: CreateActivityDto,
    @UploadedFiles(new OptionalFileValidationPipe())
    file?: Express.Multer.File[],
  ) {
    if (!file) {
      return await this.activityService.createActivity(emailAddress, dto);
    }
    return await this.activityService.createActivity(emailAddress, dto, file);
  }

  @IsAuthorizedUser()
  @Get('')
  @ApiOperation({
    description: 'Gets all activities related to a user',
  })
  @ApiOkResponse({ status: 201, description: 'Activities were returned' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async getAllUserActivities(
    @GetCurrentUserFromJwt() emailAddress: string,
    @Query('search') search?: string,
  ): Promise<ActivityResponseDto[]> {
    return await this.activityService.getAllUserActivities(emailAddress, search);
  }

  @IsAuthorizedUser()
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

  @IsAuthorizedUser()
  @Get(':categoryName/activity')
  @ApiOperation({
    description: 'Gets activities by category name',
  })
  @ApiOkResponse({ status: 201, description: 'Activities were returned' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async getAllUserActivitiesByCategoryName(
    @Param('categoryName') categoryName: string,
    @GetCurrentUserFromJwt() emailAddress: string,
  ) {
    return this.activityService.getUserActivitiesByCategoryName(categoryName, emailAddress);
  }

  @IsAuthorizedUser()
  @Get(':id')
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
  async getOneUserActivity(
    @Param('id') id: number,
    @GetCurrentUserFromJwt() emailAddress: string,
  ): Promise<ActivityResponseDto> {
    return this.activityService.getUserActivity(id, emailAddress);
  }

  @IsAuthorizedUser()
  @Patch(':id/update')
  @ApiOperation({
    summary: 'Updates an activity',
    description: 'An activity is updated by a user',
  })
  @ApiOkResponse({ status: 201, description: 'The Activity has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  @UseInterceptors(FilesInterceptor('files', 5))
  async updateUserActivity(
    @Param('id') activityId: number,
    @Body() dto: UpdateActivityDto,
    @GetCurrentUserFromJwt() emailAddress: string,
    @UploadedFiles(new OptionalFileValidationPipe())
    files?: Express.Multer.File[],
  ) {
    return this.activityService.updateActivity(activityId, dto, emailAddress, files);
  }

  @IsAuthorizedUser()
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
