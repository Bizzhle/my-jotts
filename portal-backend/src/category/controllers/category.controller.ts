import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCurrentUserEmail } from '../../app/decorators/jwt.decorators';
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
  async getAllCategories(@GetCurrentUserEmail() emailAddress: string) {
    return await this.categoryService.getAllUserCategories(emailAddress);
  }

  @IsAuthorizedUser()
  @Get(':categoryId')
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
    @GetCurrentUserEmail() emailAddress: string,
  ) {
    return this.categoryService.getCategoryById(categoryId, emailAddress);
  }

  @IsAuthorizedUser()
  @Post()
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
    @GetCurrentUserEmail() emailAddress: string,
    @Body() dto: CreateCategoryDto,
    @Req() req: Request,
  ) {
    return await this.categoryService.createCategory(dto, emailAddress, req.headers);
  }

  @IsAuthorizedUser()
  @Patch(':id/update')
  async updateCategory(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryDto,
    @GetCurrentUserEmail() emailAddress: string,
  ) {
    return this.categoryService.updateCategory(id, dto, emailAddress);
  }

  @IsAuthorizedUser()
  @Delete(':id/delete')
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in or invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server unavailable' })
  async remove(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
