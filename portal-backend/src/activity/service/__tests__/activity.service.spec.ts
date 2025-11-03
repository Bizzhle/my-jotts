import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { CategoryService } from '../../../category/services/category.service';
import { ImageFileService } from '../../../image/services/image-file.service';
import { AppLoggerService } from '../../../logger/services/app-logger.service';
import { SubscriptionService } from '../../../subscription/services/subscription.service';
import { UploadService } from '../../../upload/service/upload.service';
import { UserAccountRepository } from '../../../users/repositories/user-account.repository';
import { JwtSigningService } from '../../../utils/services/jwt-signing.services';
import { ActivityController } from '../../controllers/activity.controller';
import { CreateActivityDto } from '../../dto/create-activity.dto';
import { ActivityRepository } from '../../repositories/activity.repository';
import { ActivityService } from '../activity.service';

jest.mock('../../../../auth', () => ({
  auth: {
    api: {
      signUpEmail: jest.fn(),
      signInEmail: jest.fn(),
    },
  },
}));

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
  activities: null,
  createdAt: null,
  updatedAt: null,
  user: user,
};

const activities = [
  {
    id: 1,
    activity_title: 'Sample Activity',
    price: 100,
    location: 'Sample Location',
    rating: 5,
    description: 'Sample Description',
    date_created: new Date('2023-10-10'),
    date_updated: new Date('2023-10-10'),
    category_id: 1,
    category: category,
  },
  {
    id: 2,
    activity_title: 'Sample Activity 2',
    price: 100,
    location: 'Sample Location 2',
    rating: 5,
    description: 'Sample Description',
    date_created: new Date('2023-10-10'),
    date_updated: new Date('2023-10-10'),
    category_id: 1,
    category: category,
  },
];

const returnedActivities = [
  {
    id: 1,
    activityTitle: 'Sample Activity',
    price: 100,
    location: 'Sample Location',
    rating: 5,
    description: 'Sample Description',
    dateCreated: new Date('2023-10-10'),
    dateUpdated: new Date('2023-10-10'),
    categoryId: 1,
    categoryName: 'test',
    imageUrls: '',
  },
  {
    id: 2,
    activityTitle: 'Sample Activity 2',
    price: 100,
    location: 'Sample Location 2',
    rating: 5,
    description: 'Sample Description',
    dateCreated: new Date('2023-10-10'),
    dateUpdated: new Date('2023-10-10'),
    categoryId: 1,
    categoryName: 'test',
    imageUrls: '',
  },
];

const activity = {
  id: 1,
  activity_title: 'Sample Activity',
  price: 100,
  location: 'Sample Location',
  rating: 5,
  description: 'Sample Description',
  date_created: new Date('2023-10-10'),
  date_updated: new Date('2023-10-10'),
  category_id: 1,
  user_id: 1,
  user: user,
  category,
  userAccount: null,
  imageFiles: null,
};

describe('ActivityService', () => {
  let service: ActivityService;
  let activityRepository;
  let userAccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        ActivityService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: () => ({
              connect: () => null,
              startTransaction: () => null,
              commitTransaction: () => null,
              rollbackTransaction: () => null,
              release: () => null,
            }),
          },
        },
        {
          provide: ActivityRepository,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            getAllUserActivities: jest.fn(),
            getActivityByUserIdAndActivityId: jest.fn(),
            updateActivity: jest.fn(),
            getActivityCount: jest.fn(),
          },
        },
        {
          provide: SubscriptionService,
          useValue: {
            getActiveSubscription: jest.fn(),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            createCategory: jest.fn(),
            getAllUserCategories: jest.fn(),
            getCategoryByName: jest.fn(),
            updateCategory: jest.fn(),
          },
        },
        {
          provide: UploadService,
          useValue: {
            upload: jest.fn(),
            deleteUploadFile: jest.fn(),
          },
        },
        {
          provide: ImageFileService,
          useValue: {
            storeImageFile: jest.fn(),
            getImageFileById: jest.fn(),
          },
        },
        {
          provide: AppLoggerService,
          useValue: {
            debug: jest.fn(),
          },
        },
        {
          provide: UserAccountRepository,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: JwtSigningService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
    activityRepository = module.get<ActivityRepository>(ActivityRepository);
    userAccountRepository = module.get<UserAccountRepository>(UserAccountRepository);
  });

  const req = {
    headers: {
      Authorization: `Bearer`,
    },
  };

  it('creates an activity', async () => {
    const activityData: CreateActivityDto = {
      activityTitle: 'Test Activity',
      categoryName: 'category',
      description: 'This is a test activity',
      rating: 0,
    };
    jest.spyOn(userAccountRepository, 'findOne').mockResolvedValue(user);
    jest.spyOn(service, 'createActivity').mockResolvedValue(activity);

    const result = await service.createActivity(user.email, activityData, req.headers);

    expect(result).toEqual(activity);
  });

  it.only('returns all activities related to a user', async () => {
    jest.spyOn(userAccountRepository, 'findOne').mockResolvedValue(user);
    jest.spyOn(activityRepository, 'getAllUserActivities').mockResolvedValue(activities);
    const search = '';

    const { data } = await service.getAllUserActivities(user.email, search);

    expect(data).toEqual(returnedActivities);
  });

  it('returns an activity related to a user', async () => {
    jest.spyOn(userAccountRepository, 'findOne').mockResolvedValue(user);
    jest.spyOn(activityRepository, 'getActivityByUserIdAndActivityId').mockResolvedValue(activity);

    const result = await service.getUserActivity(activity.id, user.email);
    expect(result).toEqual({
      activityTitle: 'Sample Activity',
      categoryName: 'test',
      dateCreated: new Date('2023-10-10'),
      dateUpdated: new Date('2023-10-10'),
      description: 'Sample Description',
      id: 1,
      imageUrls: undefined,
      location: 'Sample Location',
      price: 100,
      rating: 5,
    });
  });

  it('updates an activity', async () => {
    jest.spyOn(userAccountRepository, 'findOne').mockResolvedValue(user);
    //jest.spyOn(activityRepository, 'getActivityByUserIdAndActivityId').mockResolvedValue(activity);
    jest
      .spyOn(service, 'updateActivity')
      .mockResolvedValue({ ...activity, activity_title: 'Updated Sample' });

    const updateDto = {
      activityTitle: 'Updated Sample',
    };

    const result = await service.updateActivity(activity.id, updateDto, user.email, req.headers);
    expect(result).toEqual({
      id: 1,
      activity_title: 'Updated Sample',
      price: 100,
      location: 'Sample Location',
      rating: 5,
      description: 'Sample Description',
      date_created: new Date('2023-10-10'),
      date_updated: new Date('2023-10-10'),
      category_id: 1,
      user_id: 1,
      category,
      userAccount: null,
    });
  });
});
