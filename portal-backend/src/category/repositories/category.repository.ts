import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(ds: DataSource) {
    super(Category, ds.manager);
  }

  public async createCategory(dto: CreateCategoryDto, userId: number): Promise<Category> {
    const category = this.create({
      user_id: userId,
      category_name: dto.categoryName,
      description: dto.description,
    });
    await this.save<Category>(category);

    return category;
  }

  public async findAllCategoriesForUser(userId: number): Promise<Category[]> {
    return this.find({
      where: { user_id: userId },
      order: { updatedAt: 'DESC' },
    });
  }

  public async getCategoryById(categoryId: number): Promise<Category> {
    return await this.createQueryBuilder('category')
      .where('category.id = :categoryId', {
        categoryId,
      })
      .getOne();
  }

  public async findCategoryById(categoryId: number): Promise<Category> {
    return await this.findOneBy({ id: categoryId });
  }

  public async findUserCategoryById(categoryId: number, userId: number): Promise<Category> {
    return await this.findOneBy({ user_id: userId, id: categoryId });
  }

  public async updateCategory(id: number, dto: UpdateCategoryDto, userId: number) {
    await this.update(
      { id: id, user_id: userId },
      { category_name: dto.categoryName, description: dto.description },
    );
  }

  public async findCategoryByName(
    categoryName: string,
    user_id: number,
  ): Promise<Category | undefined> {
    return this.createQueryBuilder('category')
      .where('LOWER(category.category_name) = LOWER(:categoryName)', {
        categoryName,
      })
      .andWhere('category.user_id = :user_id', { user_id })
      .getOne();
  }

  async deleteCategory(category: Category): Promise<void> {
    await this.remove(category);
  }
}
