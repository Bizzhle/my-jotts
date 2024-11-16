import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from '../activity.service';
import { ActivityController } from '../../controllers/activity.controller';
import { CategoryService } from '../../../category/services/category.service';
import { UserAccountRepository } from '../../../users/repositories/user-account.repository';
import { CreateActivityDto } from '../../dto/create-activity.dto';
import { DataSource } from 'typeorm';
import { ActivityRepository } from '../../repositories/activity.repository';
import { UploadService } from '../../../upload/service/upload.service';
import { ImageFileService } from '../../../image/services/image-file.service';
import { AppLoggerService } from '../../../logger/services/app-logger.service';
import { JwtSigningService } from '../../../utils/services/jwt-signing.services';
import { Activity } from '../../entities/activity.entity';
import { Category } from '../../../category/entities/category.entity';

const category = {
  id: 1,
  user_id: 1,
  category_name: 'test',
  description: '',
  userAccount: null,
  activities: null,
};
const activities: Partial<Activity>[] = [
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
    user_id: 1,
    category,
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
    user_id: 1,
    category,
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
  category,
  userAccount: null,
};

const mockUser = {
  id: 1,
  email_address: 'email@email.com',
  first_name: 'email',
  last_name: 'test',
  registration_date: new Date(),
  last_logged_in: new Date(),
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

  it('creates an activity', async () => {
    const activityData: CreateActivityDto = {
      activityTitle: 'Test Activity',
      categoryName: 'category',
      description: 'This is a test activity',
      rating: 0,
    };
    jest.spyOn(userAccountRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(service, 'createActivity').mockResolvedValue(activity);

    const result = await service.createActivity(mockUser.email_address, activityData);

    expect(result).toEqual(activity);
  });

  it('returns all activities related to a user', async () => {
    jest.spyOn(userAccountRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(activityRepository, 'getAllUserActivities').mockResolvedValue(activities);
    const search = '';

    const result = await service.getAllUserActivities(mockUser.email_address, search);
    expect(result).toEqual([
      {
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
      },
      {
        activityTitle: 'Sample Activity 2',
        categoryName: 'test',
        dateCreated: new Date('2023-10-10'),
        dateUpdated: new Date('2023-10-10'),
        description: 'Sample Description',
        id: 2,
        imageUrls: undefined,
        location: 'Sample Location 2',
        price: 100,
        rating: 5,
      },
    ]);
  });

  it('returns an activity related to a user', async () => {
    jest.spyOn(userAccountRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(activityRepository, 'getActivityByUserIdAndActivityId').mockResolvedValue(activity);

    const result = await service.getUserActivity(activity.id, mockUser.email_address);
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
    jest.spyOn(userAccountRepository, 'findOne').mockResolvedValue(mockUser);
    //jest.spyOn(activityRepository, 'getActivityByUserIdAndActivityId').mockResolvedValue(activity);
    jest
      .spyOn(service, 'updateActivity')
      .mockResolvedValue({ ...activity, activity_title: 'Updated Sample' });

    const updateDto = {
      activityTitle: 'Updated Sample',
    };

    const result = await service.updateActivity(activity.id, updateDto, mockUser.email_address);
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
