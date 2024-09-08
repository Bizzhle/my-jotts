import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GetCurrentUserFromJwt } from '../../app/jwt.decorators';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryService } from '../services/category.service';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IsAuthorizedUser } from '../../auth/guards/auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @IsAuthorizedUser()
  @Get('categories')
  async getAllCategories(@GetCurrentUserFromJwt() emailAddress: string) {
    return this.categoryService.getAllUserCategories(emailAddress);
  }

  @IsAuthorizedUser()
  @Post()
  @ApiOperation({
    summary: 'Creates a category',
    description: 'An category is created by a user',
  })
  @ApiOkResponse({ status: 201, description: 'The Category has been successfully created.' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  @ApiServiceUnavailableResponse()
  async createCategory(
    @GetCurrentUserFromJwt() emailAddress: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return await this.categoryService.createCategory(dto, emailAddress);
  }

  @IsAuthorizedUser()
  @Patch(':id/update')
  async updateCategory(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryDto,
    @GetCurrentUserFromJwt() emailAddress: string,
  ) {
    return this.categoryService.updateCategory(id, dto, emailAddress);
  }

  @IsAuthorizedUser()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
