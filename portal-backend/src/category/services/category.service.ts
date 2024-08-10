import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ActivityRepository } from '../../activity/repositories/activity.repository';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { UsersService } from '../../users/services/user-service/users.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';
import { WithTransactionService } from '../../app/services/with-transaction.services';
import { DataSource } from 'typeorm';

@Injectable()
export class CategoryService extends WithTransactionService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly usersService: UsersService,
    private readonly customLogger: AppLoggerService,
    private readonly datasource: DataSource,
  ) {
    super();
  }

  public async createCategory(dto: CreateCategoryDto, emailAddress: string): Promise<Category> {
    const transaction = await this.createTransaction(this.datasource);

    try {
      const user = await this.usersService.getUserByEmail(emailAddress);

      if (!user) {
        throw new UnauthorizedException('User not available');
      }

      const category = await this.categoryRepository.findCategoryByName(dto.categoryName, user.id);

      if (!category) {
        return await this.categoryRepository.createCategory(dto, user.id);
      }
      await transaction.commitTransaction();

      return category;
    } catch {
      await transaction.rollbackTransaction();
      throw new BadRequestException('Cannot register user');
    } finally {
      await this.closeTransaction(transaction);
    }
  }

  public async getAllUserCategories(emailAddress: string): Promise<Category[]> {
    const user = await this.usersService.getUserByEmail(emailAddress);
    if (!user) {
      throw new BadRequestException('User not logged in');
    }
    return this.categoryRepository.findAllCategoriesForUser(user.id);
  }

  public async getCategoryByName(name: string, userId: number) {
    return await this.categoryRepository.findCategoryByName(name, userId);
  }

  async updateCategory(id: number, dto: UpdateCategoryDto, emailAddress: string) {
    const user = await this.usersService.getUserByEmail(emailAddress);

    if (!user) {
      throw new BadRequestException('User not logged in');
    }

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
