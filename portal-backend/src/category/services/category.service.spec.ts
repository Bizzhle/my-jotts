import { Test, TestingModule } from '@nestjs/testing';
import { ActivityRepository } from '../../activity/repositories/activity.repository';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { SubscriptionService } from '../../subscription/services/subscription.service';
import { UsersService } from '../../users/services/user-service/users.service';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryService } from './category.service';

jest.mock('../../../auth', () => ({
  auth: {
    api: {
      signUpEmail: jest.fn(),
      signInEmail: jest.fn(),
    },
  },
}));

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository;
  let usersService;

  const MOCK_DATE = new Date('2021-10-05T00:00:00.000Z');
  const user = {
    id: '7e5e-eb89-4610-ad58-a50023',
    name: 'test',
    email: 'test@test.com',
    emailVerified: true,
    image: '',
    createdAt: MOCK_DATE,
    updatedAt: MOCK_DATE,
    role: 'user',
    stripeCustomerId: '',
    categories: null,
    activities: null,
    imageFiles: null,
    invoices: null,
  };

  const category = {
    id: 1,
    category_name: 'test',
    description: '',
    createdAt: null,
    updatedAt: null,
    activities: null,
    user: user,
    parentCategory: null,
    subCategories: null,
  };

  const categoryResponse = {
    id: 1,
    categoryName: 'test',
    description: '',
    createdAt: null,
    updatedAt: null,
    activities: null,
    user: user,
    parentCategory: null,
    subCategories: null,
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
          provide: SubscriptionService,
          useValue: {
            getActiveSubscription: jest.fn(),
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

    jest.useFakeTimers();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    usersService = module.get<UsersService>(UsersService);
  });

  const req = {
    headers: {
      Authorization: `Bearer`,
    },
  };

  it('creates a category', async () => {
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(service, 'createCategory').mockResolvedValue(category);

    const createDto = {
      categoryName: 'test category',
      description: 'Test',
    };
    const result = await service.createCategory(createDto, user.email, req.headers);
    expect(result).toEqual(category);
  });

  it('creates a category with subcategory', async () => {
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(service, 'createCategory').mockResolvedValue(category);

    const createDto = {
      categoryName: 'test category',
      description: 'Test',
      subCategoryName: 'sub category',
    };
    const result = await service.createCategory(createDto, user.email, req.headers);
    expect(result).toEqual(category);
  });

  it('returns all user categories related to user', async () => {
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(service, 'getAllUserCategories').mockResolvedValue([categoryResponse]);

    const res = await service.getAllUserCategories(user.email);
    expect(res).toEqual([categoryResponse]);
  });

  it('updates a category', async () => {
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
    jest
      .spyOn(categoryRepository, 'updateCategory')
      .mockResolvedValue({ ...category, category_name: 'updated category' });

    const updateDto = {
      categoryName: 'test category',
      description: 'Test',
    };
    const result = await service.updateCategory(category.id, updateDto, user.email);

    expect(result).toEqual({
      id: 1,
      category_name: 'updated category',
      description: '',
      createdAt: null,
      updatedAt: null,
      activities: null,
      user: user,
      parentCategory: null,
      subCategories: null,
    });
  });

  it('deletes an activity', async () => {
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(service, 'deleteCategory').mockResolvedValue();

    const res = await service.deleteCategory(category.id);
    expect(res).toEqual(undefined);
  });
});
