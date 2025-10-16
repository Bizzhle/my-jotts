import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCurrentUserFromJwt } from '../../app/jwt.decorators';
import { IsAuthorizedUser } from '../../auth/guards/auth.guard';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryService } from '../services/category.service';
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @IsAuthorizedUser()
  @Get('categories')
  @ApiBearerAuth()
  async getAllCategories(@GetCurrentUserFromJwt() emailAddress: string) {
    return this.categoryService.getAllUserCategories(emailAddress);
  }

  @IsAuthorizedUser()
  @Get(':categoryId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a category by ID',
    description: 'Fetches a category by its ID for the authorized user',
  })
  @ApiOkResponse({ description: 'Category found successfully.' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async getCategoryById(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @GetCurrentUserFromJwt() emailAddress: string,
  ) {
    return this.categoryService.getCategoryById(categoryId, emailAddress);
  }

  @IsAuthorizedUser()
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Creates a category',
    description: 'An category is created by a user',
  })
  @ApiOkResponse({ description: 'The Category has been successfully created.' })
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
  @ApiBearerAuth()
  async updateCategory(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryDto,
    @GetCurrentUserFromJwt() emailAddress: string,
  ) {
    return this.categoryService.updateCategory(id, dto, emailAddress);
  }

  @IsAuthorizedUser()
  @Delete(':id/delete')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async remove(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
