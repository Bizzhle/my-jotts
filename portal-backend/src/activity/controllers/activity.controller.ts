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
} from '@nestjs/common';
import { ApiResponse, ApiServiceUnavailableResponse } from '@nestjs/swagger';
import { GetCurrentUserFromJwt } from '../../app/jwt.decorators';
import { IsAuthenticatedUser } from '../../users/guards/jwt.auth.guard';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { ActivityService } from '../service/activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @IsAuthenticatedUser()
  @Post()
  @ApiServiceUnavailableResponse()
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  async createActivity(
    @GetCurrentUserFromJwt() emailAddress: string,
    @Body() dto: CreateActivityDto,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.activityService.createActivity(emailAddress, dto, file);
  }

  @IsAuthenticatedUser()
  @Get('activities')
  async getAllUserActivities(@GetCurrentUserFromJwt() emailAddress: string) {
    return this.activityService.getAllUserActivities(emailAddress);
  }

  @IsAuthenticatedUser()
  @Get(':categoryId/activity')
  async getAllUserActivitiesByCategory(
    @Param('categoryId') categoryId: number,
    @GetCurrentUserFromJwt() emailAddress: string,
  ) {
    return this.activityService.getUserActivitiesByCategory(categoryId, emailAddress);
  }

  @IsAuthenticatedUser()
  @Get(':id')
  async getOneUserActivity(@Param('id') id: number, @GetCurrentUserFromJwt() emailAddress: string) {
    return this.activityService.getUserActivity(id, emailAddress);
  }

  @IsAuthenticatedUser()
  @Patch(':id/update')
  updateUserActivity(
    @Param('id') id: number,
    @Body() dto: UpdateActivityDto,
    @GetCurrentUserFromJwt() emailAddress: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg)$/i }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.activityService.updateActivity(id, dto, emailAddress, file);
  }

  @IsAuthenticatedUser()
  @Delete(':id/delete')
  removeUserActivity(@Param('id') id: number) {
    return this.activityService.remove(id);
  }
}
