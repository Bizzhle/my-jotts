import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityRepository } from '../../activity/repositories/activity.repository';
import { CustomLogger } from '../../logs/services/customLogger';
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
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext('CategoryService');
  }

  public async createCategory(dto: CreateCategoryDto, emailAddress: string): Promise<Category> {
    const user = await this.usersService.getUserByEmail(emailAddress);

    if (!user) {
      this.customLogger.warn('About to return cats!');
    }
    return await this.categoryRepository.createCategory(dto, user.id);
  }

  public async getAllUserCategories(emailAddress: string): Promise<Category[]> {
    const user = await this.usersService.getUserByEmail(emailAddress);
    return this.categoryRepository.findAllCategoriesForUser(user.id);
  }

  // public async getEntriesByCategory(id: number): Promise<Activity[]> {
  //   return this.activityRepository.find({
  //     where: {
  //       : id
  //     }
  //   });
  // }

  async updateCategory(id: number, dto: UpdateCategoryDto, emailAddress: string) {
    const user = await this.usersService.getUserByEmail(emailAddress);

    return await this.categoryRepository.updateCategory(id, dto, user.id);
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepository.findCategoryById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // check if categories has associated entries
    const countEntries = await this.activityRepository.count({ where: { category } });

    if (countEntries > 0) {
      throw new Error('Cannot delete category with associated entries');
    }

    await this.categoryRepository.deleteCategory(category);
  }
}
