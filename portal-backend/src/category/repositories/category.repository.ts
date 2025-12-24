import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryResponseDto } from '../dto/response-dto/category-response.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(ds: DataSource) {
    super(Category, ds.manager);
  }

  public async createCategory(dto: CreateCategoryDto, userId: string): Promise<Category> {
    const category = this.create({
      user: { id: userId },
      category_name: dto.categoryName,
      description: dto.description,
      createdAt: new Date(),
    });
    await this.save<Category>(category);

    return category;
  }

  public async findAllCategoriesForUser(userId: string): Promise<CategoryResponseDto[]> {
    const categories = await this.createQueryBuilder('category')
      .leftJoinAndSelect('category.parentCategory', 'parentCategory')
      .select([
        'category.id',
        'category.category_name',
        'category.description',
        'parentCategory.id',
        'parentCategory.category_name',
        'parentCategory.description',
      ])
      .where('category.userId = :userId', { userId })
      .orderBy('category.updatedAt', 'DESC')
      .getMany();

    // Map to CategoryResponseDto shape
    return categories.map((cat: any) => ({
      id: cat.id,
      categoryName: cat.category_name,
      description: cat.description,
      parentCategories: cat.parentCategory
        ? {
            id: cat.parentCategory.id,
            categoryName: cat.parentCategory.category_name,
            description: cat.parentCategory.description,
          }
        : undefined,
    }));
  }

  public async getCategoryById(categoryId: number): Promise<CategoryResponseDto> {
    const category = await this.createQueryBuilder('category')
      .leftJoinAndSelect('category.parentCategory', 'parentCategory')
      .where('category.id = :categoryId', {
        categoryId,
      })
      .getOne();

    if (!category) {
      return null;
    }

    return {
      id: category.id,
      categoryName: category.category_name,
      description: category.description,
      parentCategories: category.parentCategory
        ? {
            id: category.parentCategory.id,
            categoryName: category.parentCategory.category_name,
            description: category.parentCategory.description,
          }
        : undefined,
    };
  }

  /**
   * Returns a category and its parent categories (if any) by categoryId.
   */
  public async getCategoryWithParents(categoryId: number): Promise<Category | null> {
    return this.createQueryBuilder('category')
      .leftJoinAndSelect('category.parentCategory', 'parentCategory')
      .where('category.id = :categoryId', { categoryId })
      .getOne();
  }

  public async findCategoryById(categoryId: number): Promise<Category> {
    return await this.findOneBy({ id: categoryId });
  }

  public async findUserCategoryById(categoryId: number, userId: string): Promise<Category> {
    return await this.findOneBy({ user: { id: userId }, id: categoryId });
  }

  public async findSubCategoriesByParentId(parentId: number): Promise<Category[]> {
    return await this.createQueryBuilder('category')
      .where('category.parentCategory.id = :parentId', {
        parentId,
      })
      .getMany();
  }

  public async updateCategory(id: number, dto: UpdateCategoryDto, userId: string) {
    await this.update(
      { id: id, user: { id: userId } },
      { category_name: dto.categoryName, description: dto.description, createdAt: new Date() },
    );
  }

  public async findCategoryByName(
    categoryName: string,
    userId: string,
  ): Promise<Category | undefined> {
    return this.createQueryBuilder('category')
      .where('LOWER(category.category_name) = LOWER(:categoryName)', {
        categoryName,
      })
      .andWhere('category.userId = :userId', { userId })
      .getOne();
  }

  async deleteCategory(category: Category): Promise<void> {
    await this.remove(category);
  }
}
