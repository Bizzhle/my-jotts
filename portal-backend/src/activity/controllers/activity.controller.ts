import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile } from '@nestjs/common';
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
  @Get(':categoryId/category')
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
  @ApiServiceUnavailableResponse()
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  async updateUserActivity(
    @Param('id') id: number,
    @Body() dto: UpdateActivityDto,
    @GetCurrentUserFromJwt() emailAddress: string,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.activityService.updateActivity(id, dto, emailAddress, file);
  }

  // @IsAuthenticatedUser()
  // @Patch(':id/update')
  // async updateCategory(
  //   @Param('id') id: number,
  //   @Body() dto: UpdateActivityDto,
  //   @GetCurrentUserFromJwt() emailAddress: string,
  // ) {
  //   return ' this.categoryService.updateCategory(id, dto, emailAddress)';
  // }

  @IsAuthenticatedUser()
  @Delete(':id/delete')
  removeUserActivity(@Param('id') id: number) {
    return this.activityService.remove(id);
  }
}
