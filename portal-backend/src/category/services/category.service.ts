import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ActivityRepository } from '../../activity/repositories/activity.repository';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { SubscriptionStatus } from '../../subscription/enum/subscrition.enum';
import { SubscriptionService } from '../../subscription/services/subscription.service';
import { UsersService } from '../../users/services/user-service/users.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly usersService: UsersService,
    private readonly subscriptionService: SubscriptionService,
    private readonly loggerService: AppLoggerService,
  ) {}

  public async createCategory(
    dto: CreateCategoryDto,
    emailAddress: string,
    entityManager?: EntityManager,
  ): Promise<Category> {
    try {
      let createdCategory;
      const user = await this.usersService.getUserByEmail(emailAddress);

      if (!user) {
        throw new UnauthorizedException('User not available');
      }

      const categoryCount = await this.categoryRepository.count({ where: { user_id: user.id } });

      const subscription = await this.subscriptionService.getUserSubscriptionInformation(
        user.email_address,
      );
      const isSubscriptionActive =
        subscription && subscription.status === SubscriptionStatus.active;

      if (!isSubscriptionActive && categoryCount >= 5) {
        throw new ForbiddenException('Maximum categories');
      }

      const category = await this.categoryRepository.findCategoryByName(dto.categoryName, user.id);

      if (category) {
        throw new ConflictException('Category with this name already exists.');
      }

      if (entityManager) {
        const category = await this.categoryRepository.create({
          user_id: user.id,
          category_name: dto.categoryName,
          description: dto.description,
        });
        createdCategory = await entityManager.save(Category, category);
      } else {
        createdCategory = await this.categoryRepository.createCategory(dto, user.id);
      }
      await this.loggerService.log('Category created');
      return createdCategory;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while creating the category');
    }
  }

  public async getAllUserCategories(emailAddress: string): Promise<Category[]> {
    const user = await this.usersService.getUserByEmail(emailAddress);
    if (!user) {
      throw new BadRequestException('User not logged in');
    }
    return this.categoryRepository.findAllCategoriesForUser(user.id);
  }

  async getCategoryById(id: number, emailAddress: string): Promise<Category> {
    const user = await this.usersService.getUserByEmail(emailAddress);
    if (!user) {
      throw new UnauthorizedException('User not logged in');
    }
    return this.categoryRepository.findUserCategoryById(id, user.id);
  }

  public async getCategoryByName(name: string, userId: number) {
    return await this.categoryRepository.findCategoryByName(name, userId);
  }

  async updateCategory(id: number, dto: UpdateCategoryDto, emailAddress: string) {
    const user = await this.usersService.getUserByEmail(emailAddress);

    if (!user) {
      throw new UnauthorizedException('User not logged in');
    }

    return await this.categoryRepository.updateCategory(id, dto, user.id);
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepository.findCategoryById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // check if categories have associated entries
    const countEntries = await this.activityRepository.count({ where: { category } });

    if (countEntries > 0) {
      throw new ConflictException('Cannot delete category with associated entries');
    }

    await this.categoryRepository.deleteCategory(category);
  }
}
