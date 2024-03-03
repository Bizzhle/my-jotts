import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { GetCurrentUserFromJwt } from '../../app/jwt.decorators';
import { IsAuthenticatedUser } from '../../users/guards/jwt.auth.guard';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryService } from '../services/category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @IsAuthenticatedUser()
  @Get('categories')
  async getAllCategories(@GetCurrentUserFromJwt() emailAddress: string) {
    return this.categoryService.getAllUserCategories(emailAddress);
  }

  // @IsAuthenticatedUser()
  // @Get(':id/entries')
  // async getEntriesByCategory(@Param('id') id: number) {
  //   return this.categoryService.getEntriesByCategory(id);
  // }

  @IsAuthenticatedUser()
  @Post()
  async createCategory(
    @GetCurrentUserFromJwt() emailAddress: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(dto, emailAddress);
  }

  @IsAuthenticatedUser()
  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryDto,
    @GetCurrentUserFromJwt() emailAddress: string,
  ) {
    return this.categoryService.updateCategory(id, dto, emailAddress);
  }

  @IsAuthenticatedUser()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
