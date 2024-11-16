import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { UsersService } from '../../users/services/user-service/users.service';
import { ActivityRepository } from '../../activity/repositories/activity.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { moveCursor } from 'readline';
import { result } from 'lodash';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository;
  let usersService;

  const mockUser = {
    id: 1,
    email_address: 'email@email.com',
    first_name: 'email',
    last_name: 'test',
    registration_date: new Date(),
    last_logged_in: new Date(),
  };

  const category = {
    id: 1,
    category_name: 'test category',
    user_id: mockUser.id,
    description: 'Test',
    userAccount: null,
    activities: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: {
            findCategoryById: jest.fn(),
            findCategoryByName: jest.fn(),
            findAllCategoriesForUser: jest.fn(),
            createCategory: jest.fn(),
            updateCategory: jest.fn(),
            deleteCategory: jest.fn(),
          },
        },
        {
          provide: AppLoggerService,
          useValue: {
            debug: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
        {
          provide: ActivityRepository,
          useValue: {
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    usersService = module.get<UsersService>(UsersService);
  });

  it('creates a category', async () => {
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);
    jest.spyOn(service, 'createCategory').mockResolvedValue(category);

    const createDto = {
      categoryName: 'test category',
      description: 'Test',
    };
    const result = await service.createCategory(createDto, mockUser.email_address);
    expect(result).toEqual(category);
  });

  it('returns all user categories related to user', async () => {
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);
    jest.spyOn(service, 'getAllUserCategories').mockResolvedValue([category]);

    const res = await service.getAllUserCategories(mockUser.email_address);
    expect(res).toEqual([category]);
  });

  it('updates a category', async () => {
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);
    jest
      .spyOn(categoryRepository, 'updateCategory')
      .mockResolvedValue({ ...category, category_name: 'updated category' });

    const updateDto = {
      categoryName: 'test category',
      description: 'Test',
    };
    const result = await service.updateCategory(category.id, updateDto, mockUser.email_address);
    expect(result).toEqual({
      id: 1,
      category_name: 'updated category',
      user_id: mockUser.id,
      description: 'Test',
      userAccount: null,
      activities: null,
    });
  });

  it('deletes an activity', async () => {
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);
    jest.spyOn(service, 'deleteCategory').mockResolvedValue();

    const res = await service.deleteCategory(category.id);
    expect(res).toEqual(undefined);
  });
});
