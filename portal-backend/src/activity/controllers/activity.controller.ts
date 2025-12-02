import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCurrentUserEmail } from '../../app/decorators/jwt.decorators';
import { Permissions } from '../../auth/decorators/permission.decorator';
import { IsAuthorizedUser } from '../../auth/guards/auth.guard';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { PaginationQueryDto } from '../dto/paginationQuery.dto';
import { ActivityResponseDto } from '../dto/response-dto/activityResponse.dto';
import { ListWithActivityPaginationResponseDto } from '../dto/response-dto/ListWithActivityPaginationResponse.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { ActivityService } from '../service/activity.service';
import { OptionalFileValidationPipe } from '../validator/optional-parse-file';
@ApiTags('Activities')
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @IsAuthorizedUser()
  @Permissions({ activity: ['create'] })
  @Post()
  @ApiOperation({
    summary: 'Creates an activity',
    description: 'An activity is created by a user',
  })
  @ApiOkResponse({ description: 'The Activity has been successfully created.' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  @UseInterceptors(FilesInterceptor('files', 3))
  async createActivity(
    @GetCurrentUserEmail() emailAddress: string,
    @Req() req: Request,
    @Body() dto: CreateActivityDto,
    @UploadedFiles(new OptionalFileValidationPipe())
    file?: Express.Multer.File[],
  ) {
    if (!file) {
      return await this.activityService.createActivity(emailAddress, dto, req.headers);
    }
    return await this.activityService.createActivity(emailAddress, dto, req.headers, file);
  }

  @IsAuthorizedUser()
  @Get('')
  @ApiOperation({
    description: 'Gets all activities related to a user',
  })
  @ApiOkResponse({ description: 'Activities were returned' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async getAllUserActivities(
    @GetCurrentUserEmail() emailAddress: string,
    @Req() req: Request,
    @Query('search') search?: string,
    @Query() paginationDto?: PaginationQueryDto,
  ): Promise<ListWithActivityPaginationResponseDto<ActivityResponseDto>> {
    return await this.activityService.getAllUserActivities(emailAddress, search, paginationDto);
  }

  @IsAuthorizedUser()
  @Get(':categoryId/category')
  @ApiOperation({
    description: 'Gets activities by category',
  })
  @ApiOkResponse({ description: 'Activities were returned' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async getAllUserActivitiesByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @GetCurrentUserEmail() emailAddress: string,
    @Query() paginationDto?: PaginationQueryDto,
  ): Promise<ListWithActivityPaginationResponseDto<ActivityResponseDto>> {
    return this.activityService.getUserActivitiesByCategory(
      categoryId,
      emailAddress,
      paginationDto,
    );
  }

  @IsAuthorizedUser()
  @Get(':categoryName/activity')
  @ApiOperation({
    description: 'Gets activities by category name',
  })
  @ApiOkResponse({ description: 'Activities were returned' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async getAllUserActivitiesByCategoryName(
    @Param('categoryName') categoryName: string,
    @GetCurrentUserEmail() emailAddress: string,
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
    description: 'The Activity has been successfully returned to use.',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async getOneUserActivity(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUserEmail() emailAddress: string,
  ): Promise<ActivityResponseDto> {
    return this.activityService.getUserActivity(id, emailAddress);
  }

  @IsAuthorizedUser()
  @Patch(':id/update')
  @ApiOperation({
    summary: 'Updates an activity',
    description: 'An activity is updated by a user',
  })
  @ApiOkResponse({ description: 'The Activity has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  @UseInterceptors(FilesInterceptor('files', 5))
  async updateUserActivity(
    @Param('id') activityId: number,
    @Body() dto: UpdateActivityDto,
    @Req() req: Request,
    @GetCurrentUserEmail() emailAddress: string,
    @UploadedFiles(new OptionalFileValidationPipe())
    files?: Express.Multer.File[],
  ) {
    return this.activityService.updateActivity(activityId, dto, emailAddress, req.headers, files);
  }

  @IsAuthorizedUser()
  @Delete(':id/delete')
  @ApiOperation({
    summary: 'Deletes an activity',
    description: 'An activity is deleted by a user',
  })
  @ApiOkResponse({ description: 'The Activity has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async removeUserActivity(
    @Param('id') activityId: number,
    @GetCurrentUserEmail() emailAddress: string,
  ) {
    return this.activityService.deleteActivity(activityId, emailAddress);
  }
}
