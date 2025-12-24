import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/User.entity';
import { DataSource } from 'typeorm';
import { WithTransactionService } from '../../app/services/with-transaction.services';
import { Category } from '../../category/entities/category.entity';
import { CategoryService } from '../../category/services/category.service';
import { ImageFile } from '../../image/entities/image-file.entity';
import { ImageFileService } from '../../image/services/image-file.service';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { SubscriptionService } from '../../subscription/services/subscription.service';
import { UploadService } from '../../upload/service/upload.service';
import { UsersService } from '../../users/services/user-service/users.service';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { PAGINATION_ITEMS_PER_PAGE, PaginationQueryDto } from '../dto/paginationQuery.dto';
import { ActivityDTO, ActivityResponseDto } from '../dto/response-dto/activityResponse.dto';
import { ListWithActivityPaginationResponseDto } from '../dto/response-dto/ListWithActivityPaginationResponse.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { Activity } from '../entities/activity.entity';
import { ActivityRepository } from '../repositories/activity.repository';

interface ImageUrlDto {
  signedUrl: string;
  rawUrl: string;
}
const UN_SUBSCRIBED_MAX_ACTIVITIES = 10;
@Injectable()
export class ActivityService extends WithTransactionService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly imageUploadService: UploadService,
    private readonly categoryService: CategoryService,
    private readonly imageFileService: ImageFileService,
    private readonly subscriptionService: SubscriptionService,
    private readonly logService: AppLoggerService,
    private readonly datasource: DataSource,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async createActivity(
    emailAddress: string,
    dto: CreateActivityDto,
    headers: HeadersInit,
    file?: Express.Multer.File[],
  ) {
    const transaction = await this.createTransaction(this.datasource);

    try {
      const user = await this.usersService.getUserByEmail(emailAddress);

      await this.validateActivityCreation(user, dto, file, headers);

      let category = await this.categoryService.getCategoryByName(dto.categoryName, user.id);
      let subCategory = await this.categoryService.getCategoryByName(dto.subCategoryName, user.id);

      if (!category) {
        // Apply transaction to category creation
        category = await this.datasource.transaction(async (entityManager) => {
          return await this.categoryService.createCategory(
            { categoryName: dto.categoryName, subCategoryName: dto.subCategoryName },
            user.email,
            headers,
            entityManager, // Pass the entity manager to handle the transaction
          );
        });
      } else if (dto.subCategoryName && !subCategory) {
        // Create sub-category under existing category
        subCategory = await this.datasource.transaction(async (entityManager) => {
          return await this.categoryService.createSubCategory(
            { parentCategoryId: category.id, subCategoryName: dto.subCategoryName },
            user.email,
          );
        });
      }

      const activity = await this.activityRepository.create({
        activity_title: dto.activityTitle,
        price: dto.price,
        location: dto.location || null,
        rating: dto.rating,
        description: dto.description,
        user: user,
        category_id: subCategory ? subCategory.id : category.id,
        date_created: new Date(),
        date_updated: new Date(),
      });

      const savedActivity = await this.activityRepository.save(activity);

      if (file && file.length > 0) {
        const uploadedFiles = await Promise.all(
          file.map(
            async (file) =>
              await this.imageUploadService.upload({
                file,
                userId: user.id,
                activityId: savedActivity.id,
              }),
          ),
        );

        await Promise.all(
          uploadedFiles.map(
            async (uploadedFile) =>
              await this.imageFileService.storeImageFile(
                uploadedFile.Location,
                uploadedFile.Key,
                savedActivity.id,
                user,
              ),
          ),
        );
      }

      await transaction.commitTransaction();
      return savedActivity;
    } catch (err) {
      await transaction.rollbackTransaction();
      await this.logService.debug(err);
      throw err;
    } finally {
      await this.closeTransaction(transaction);
    }
  }

  async getAllUserActivities(
    emailAddress: string,
    search: string,
    paginationDto?: PaginationQueryDto,
  ): Promise<ListWithActivityPaginationResponseDto<ActivityResponseDto[]>> {
    const startOffset = paginationDto?.offset ?? 0;
    const activityLimit = paginationDto?.limit ?? PAGINATION_ITEMS_PER_PAGE;
    let activityCount = null;

    const user = await this.usersService.getUserByEmail(emailAddress);

    const activities = await this.activityRepository.getAllUserActivities(
      user.id,
      search,
      startOffset,
      activityLimit,
    );

    if (startOffset === 0) {
      activityCount = await this.activityRepository.getActivityCount(search, user.id);
    }

    const activityResponse = await this.batchFetchAndMapActivityImagesToResponses(
      activities,
      user.id,
    );

    return {
      offset: startOffset,
      limit: activityLimit,
      count: activityCount,
      data: activityResponse.activities,
    };
  }

  async getUserActivity(activityId: number, emailAddress: string): Promise<ActivityResponseDto> {
    const user = await this.usersService.getUserByEmail(emailAddress);

    const activity = await this.activityRepository.getActivityByUserIdAndActivityId(
      activityId,
      user.id,
    );
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${activityId} not found.`);
    }

    try {
      const imageUrls = await this.fetchActivityImages(activity.id, user.id);

      return this.mapToActivityResponse(activity, imageUrls);
    } catch (err) {
      await this.logService.debug(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Could not fetch activity');
    }
  }

  async getUserActivitiesByCategory(
    categoryId: number,
    emailAddress: string,
    paginationDto?: PaginationQueryDto,
  ): Promise<ListWithActivityPaginationResponseDto<ActivityDTO>> {
    const startOffset = paginationDto?.offset ?? 0;
    const activityLimit = paginationDto?.limit ?? PAGINATION_ITEMS_PER_PAGE;
    let activityCount = null;
    const user = await this.usersService.getUserByEmail(emailAddress);

    const { category, activities } = await this.activityRepository.getUserActivitiesByCategoryId(
      categoryId,
      user.id,
      startOffset,
      activityLimit,
    );
    if (startOffset === 0) {
      activityCount = await this.activityRepository.getActivityCount('', user.id);
    }

    const activityResponse = await this.batchFetchAndMapActivityImagesToResponses(
      activities,
      user.id,
      category,
    );

    return {
      offset: startOffset,
      limit: activityLimit,
      count: activityCount,
      data: activityResponse,
    };
  }

  async getUserActivitiesByCategoryName(
    categoryName: string,
    emailAddress: string,
  ): Promise<ActivityResponseDto[]> {
    try {
      const user = await this.usersService.getUserByEmail(emailAddress);

      const category = await this.categoryService.getCategoryByName(categoryName, user.id);

      if (!category) {
        throw new NotFoundException(`Category with name ${categoryName} not found`);
      }

      const activities = await this.activityRepository.find({
        where: {
          user: { id: user.id },
          category: { id: category.id },
        },
        relations: ['category'],
      });

      const activityResponse = await this.batchFetchAndMapActivityImagesToResponses(
        activities,
        user.id,
      );

      return activityResponse.activities;
    } catch (err) {
      await this.logService.debug(err);

      throw new InternalServerErrorException('Could not fetch activities');
    }
  }

  // @Transactional()
  async updateActivity(
    activityId: number,
    dto: UpdateActivityDto,
    emailAddress: string,
    headers: HeadersInit,
    files?: Express.Multer.File[],
  ) {
    try {
      const user = await this.usersService.getUserByEmail(emailAddress);

      const activity = await this.activityRepository.getActivityByUserIdAndActivityId(
        activityId,
        user.id,
      );

      if (!activity) {
        throw new NotFoundException();
      }

      let category = await this.categoryService.getCategoryByName(dto.categoryName, user.id);
      let subCategory = await this.categoryService.getCategoryByName(dto.subCategoryName, user.id);
      if (!category) {
        category = await this.categoryService.createCategory(
          { categoryName: dto.categoryName },
          user.email,
          headers,
        );
      } else if (dto.subCategoryName && !subCategory) {
        // Create sub-category under existing category
        subCategory = await this.datasource.transaction(async (entityManager) => {
          return await this.categoryService.createSubCategory(
            { parentCategoryId: category.id, subCategoryName: dto.subCategoryName },
            user.email,
          );
        });
      }

      const updatedActivity = await this.activityRepository.updateActivity(
        activity,
        dto,
        category.id,
      );

      // Handle image deletion
      if (dto.imagesToDelete && dto.imagesToDelete.length > 0) {
        // Get all image files for this activity
        await this.deleteActivityImages(updatedActivity.id, user.id, dto.imagesToDelete);
      }

      // Handle new file uploads
      if (files && files.length > 0) {
        await this.uploadActivityImages(updatedActivity.id, user.id, files, user);
      }
    } catch (err) {
      await this.logService.debug(err);
      throw new InternalServerErrorException('Could not update activity');
    }
  }

  async deleteActivity(activityId: number, emailAddress: string) {
    const user = await this.usersService.getUserByEmail(emailAddress);

    const activity = await this.activityRepository.getActivityByUserIdAndActivityId(
      activityId,
      user.id,
    );

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${activityId} not found.`);
    }

    try {
      // Fetch associated images
      const imageFiles =
        (await this.imageFileService.fetchImageFilesById(activity.id, user.id)) || [];

      // Delete images from S3 and database
      const deletePromises = imageFiles.map(async (imageFile) => {
        try {
          await Promise.all([
            this.imageUploadService.deleteUploadFile(imageFile.key),
            this.imageFileService.deleteSingleImageFile(imageFile),
          ]);
        } catch (err) {
          this.logService.error(`Failed to delete image ${imageFile.key}`, err.stack);
          // Continue with other deletions even if one fails
        }
      });

      await Promise.all(deletePromises);

      // Finally, delete the activity
      await this.activityRepository.delete({ id: activity.id });
    } catch (err) {
      this.logService.error('Failed to delete activity', err.stack);
      throw new InternalServerErrorException('Failed to delete activity');
    }
  }

  private async deleteActivityImages(
    activityId: number,
    userId: string,
    imagesToDelete: string[],
  ): Promise<void> {
    try {
      // Fetch current images
      const imageFiles =
        (await this.imageFileService.fetchImageFilesById(activityId, userId)) || [];

      // Validate that images belong to this activity
      const imagesToRemove = imageFiles.filter((img) => imagesToDelete.includes(img.url));

      if (imagesToRemove.length !== imagesToDelete.length) {
        const foundUrls = imagesToRemove.map((img) => img.url);
        const notFound = imagesToDelete.filter((url) => !foundUrls.includes(url));
        this.logService.warn(`Some images not found for deletion: ${notFound.join(', ')}`);
      }

      // Delete from S3 and database in parallel
      const deletePromises = imagesToRemove.map(async (imageFile) => {
        try {
          await Promise.all([
            this.imageUploadService.deleteUploadFile(imageFile.key),
            this.imageFileService.deleteSingleImageFile(imageFile),
          ]);
        } catch (err) {
          this.logService.error(`Failed to delete image ${imageFile.key}`, err.stack);
          // Continue with other deletions even if one fails
        }
      });

      await Promise.all(deletePromises);
    } catch (err) {
      this.logService.error('Failed to delete activity images', err.stack);
      throw new InternalServerErrorException('Failed to delete some images');
    }
  }

  private async uploadActivityImages(
    activityId: number,
    userId: string,
    files: Express.Multer.File[],
    user: User,
  ): Promise<void> {
    try {
      // Upload files to S3
      const uploadPromises = files.map((file) =>
        this.imageUploadService.upload({
          file,
          userId,
          activityId,
        }),
      );

      const uploadedFiles = await Promise.all(uploadPromises);

      // Store metadata in database
      const storePromises = uploadedFiles.map((uploadedFile) =>
        this.imageFileService.storeImageFile(
          uploadedFile.Location,
          uploadedFile.Key,
          activityId,
          user,
        ),
      );

      await Promise.all(storePromises);
    } catch (err) {
      this.logService.error('Failed to upload activity images', err.stack);

      // Attempt cleanup of uploaded files
      // await this.cleanupFailedUploads(files, activityId, userId);

      throw new InternalServerErrorException('Failed to upload images');
    }
  }

  // private async cleanupFailedUploads(
  //   files: Express.Multer.File[],
  //   activityId: number,
  //   userId: string,
  // ): Promise<void> {
  //   try {
  //     // Attempt to delete any partially uploaded files from S3
  //     const cleanupPromises = files.map(async (file) => {
  //       const key = this.imageUploadService.generateKey(userId, activityId, file.originalname);
  //       try {
  //         await this.imageUploadService.deleteUploadFile(key);
  //       } catch (err) {
  //         // Log but don't throw - this is best effort cleanup
  //         this.logService.warn(`Failed to cleanup file ${key}`, err);
  //       }
  //     });

  //     await Promise.all(cleanupPromises);
  //   } catch (err) {
  //     this.logService.error('Failed to cleanup after upload failure', err);
  //   }
  // }

  private async batchFetchAndMapActivityImagesToResponses(
    activities: Activity[],
    userId: string,
    category?: Category,
  ): Promise<ActivityDTO> {
    // Handle empty activity array
    if (!activities || activities.length === 0) {
      return { category: null, activities: [] };
    }

    // Fetch all activity IDs at once
    const activityIds = activities.map((a) => a.id);

    const imageFiles =
      (await this.imageFileService.fetchImageFilesByActivityIds(activityIds, userId)) || [];

    // Map activity IDs to their corresponding image files
    const groupedImagesByActivityId = await this.groupImagesByActivityId(imageFiles);

    const data = activities.map((activity) => {
      const imageFiles = groupedImagesByActivityId.get(activity.id) || [];
      return this.mapToActivityResponse(activity, imageFiles);
    });

    return { category, activities: data };
  }

  private async groupImagesByActivityId(
    imageFiles: ImageFile[],
  ): Promise<Map<number, ImageUrlDto[]>> {
    const grouped = new Map<number, { signedUrl: string; rawUrl: string }[]>();

    for (const img of imageFiles) {
      if (!grouped.has(img.activity_id)) {
        grouped.set(img.activity_id, []);
      }
      grouped.get(img.activity_id)!.push({
        signedUrl: await this.imageUploadService.getImageStreamFromS3(img.key),
        rawUrl: img.url,
      });
    }

    return grouped;
  }

  private async fetchActivityImages(activityId: number, userId: string): Promise<ImageUrlDto[]> {
    try {
      const imageFiles =
        (await this.imageFileService.fetchImageFilesById(activityId, userId)) || [];
      const imageUrls = await Promise.all(
        imageFiles.map(async (img) => ({
          signedUrl: await this.imageUploadService.getImageStreamFromS3(img.key),
          rawUrl: img.url,
        })),
      );
      return imageUrls;
    } catch (err) {
      await this.logService.debug(err);
      return [];
    }
  }

  private mapToActivityResponse(
    activity: Activity,
    imageUrls: { signedUrl: string; rawUrl: string }[],
  ): ActivityResponseDto {
    return {
      id: activity.id,
      activityTitle: activity.activity_title,
      categoryName: activity.category.category_name,
      parentCategoryName: activity.category.parentCategory?.category_name ?? null,
      categoryId: activity.category.id,
      parentCategoryId: activity.category.parentCategory?.id ?? null,
      location: activity.location,
      price: activity.price,
      rating: activity.rating,
      description: activity.description,
      dateCreated: activity.date_created,
      dateUpdated: activity.date_updated,
      imageUrls,
    };
  }

  private async validateActivityCreation(
    user: User,
    dto: CreateActivityDto,
    file?: Express.Multer.File[],
    headers?: HeadersInit,
  ) {
    // Check subscription status
    const isSubscriptionActive = await this.subscriptionService.getActiveSubscription(headers);

    const userRole = await this.usersService.findUserRoleById(user.id);

    // Check if the user has the bypassSubscription role
    const isCustomUser = userRole === 'customUsers';

    // Count user's activities
    const activityCount = await this.activityRepository.count({ where: { user: { id: user.id } } });

    // Restrict activity creation only for 'user' role without active subscription
    if (
      userRole === 'user' &&
      !isSubscriptionActive &&
      !isCustomUser &&
      activityCount >= UN_SUBSCRIBED_MAX_ACTIVITIES
    ) {
      throw new ForbiddenException({
        message: 'Upgrade required to create more activities.',
      });
    }

    // Restrict file upload if subscription is not active and more than 1 file is uploaded
    if (!isSubscriptionActive && !isCustomUser && file && file.length > 1) {
      throw new ForbiddenException({
        message: 'Maximum upload',
      });
    }

    // Check for existing activity with the same title
    const existingActivity = await this.activityRepository.findOne({
      where: {
        activity_title: dto.activityTitle,
        user: { id: user.id },
      },
    });

    if (existingActivity) {
      throw new ForbiddenException('Activity with this title already exists.');
    }
  }
}
