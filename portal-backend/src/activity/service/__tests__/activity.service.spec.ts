import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { CategoryService } from '../../../category/services/category.service';
import { ImageFileService } from '../../../image/services/image-file.service';
import { AppLoggerService } from '../../../logger/services/app-logger.service';
import { SubscriptionService } from '../../../subscription/services/subscription.service';
import { UploadService } from '../../../upload/service/upload.service';
import { UsersService } from '../../../users/services/user-service/users.service';
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
    imageUrls: [],
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
    imageUrls: [],
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
  let categoryService;
  let imageFileService;
  let uploadService;
  let usersService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
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
            transaction: jest.fn((callback) => callback({})),
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
            count: jest.fn(),
            delete: jest.fn(),
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
            getImageStreamFromS3: jest.fn(),
          },
        },
        {
          provide: ImageFileService,
          useValue: {
            storeImageFile: jest.fn(),
            getImageFileById: jest.fn(),
            fetchImageFilesById: jest.fn(),
            fetchImageFilesByActivityIds: jest.fn(),
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
          useValue: { getUserByEmail: jest.fn(), findUserRoleById: jest.fn() },
        },
        {
          provide: JwtSigningService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
    activityRepository = module.get<ActivityRepository>(ActivityRepository);
    usersService = module.get<UsersService>(UsersService);
    categoryService = module.get<CategoryService>(CategoryService);
    imageFileService = module.get<ImageFileService>(ImageFileService);
    uploadService = module.get<UploadService>(UploadService);
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
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(service, 'createActivity').mockResolvedValue(activity);

    const result = await service.createActivity(user.email, activityData, req.headers);

    expect(result).toEqual(activity);
  });

  it('creates an activity with image files', async () => {
    const activityData: CreateActivityDto = {
      activityTitle: 'Test Activity with Images',
      categoryName: 'category',
      description: 'This is a test activity with images',
      rating: 5,
      price: 100,
    };

    const mockFiles: Express.Multer.File[] = [
      {
        fieldname: 'files',
        originalname: 'test-image-1.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('fake-image-data-1'),
        size: 1024,
      } as Express.Multer.File,
      {
        fieldname: 'files',
        originalname: 'test-image-2.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('fake-image-data-2'),
        size: 2048,
      } as Express.Multer.File,
    ];

    const mockUploadResults = [
      {
        Location:
          'https://s3.amazonaws.com/bucket/users/user-id/activities/1/uuid-test-image-1.jpg',
        Key: 'users/user-id/activities/1/uuid-test-image-1.jpg',
        ETag: '"etag-1"',
        Bucket: 'bucket',
      },
      {
        Location:
          'https://s3.amazonaws.com/bucket/users/user-id/activities/1/uuid-test-image-2.png',
        Key: 'users/user-id/activities/1/uuid-test-image-2.png',
        ETag: '"etag-2"',
        Bucket: 'bucket',
      },
    ];

    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(usersService, 'findUserRoleById').mockResolvedValue(user.role);
    jest.spyOn(activityRepository, 'count').mockResolvedValue(5);
    jest.spyOn(service['subscriptionService'], 'getActiveSubscription').mockResolvedValue({
      id: 'sub_123',
      plan: 'pro',
      status: 'active',
      limits: {},
      priceId: 'price_123',
      referenceId: 'ref_123',
    } as any);
    jest.spyOn(categoryService, 'getCategoryByName').mockResolvedValue(category);
    jest.spyOn(activityRepository, 'create').mockReturnValue(activity);
    jest.spyOn(activityRepository, 'save').mockResolvedValue(activity);

    jest
      .spyOn(uploadService, 'upload')
      .mockResolvedValueOnce(mockUploadResults[0])
      .mockResolvedValueOnce(mockUploadResults[1]);

    jest.spyOn(imageFileService, 'storeImageFile').mockResolvedValue(undefined);

    const result = await service.createActivity(user.email, activityData, req.headers, mockFiles);

    expect(result).toEqual(activity);
    expect(uploadService.upload).toHaveBeenCalledTimes(2);
    expect(uploadService.upload).toHaveBeenCalledWith({
      file: mockFiles[0],
      userId: user.id,
      activityId: activity.id,
    });
    expect(uploadService.upload).toHaveBeenCalledWith({
      file: mockFiles[1],
      userId: user.id,
      activityId: activity.id,
    });
    expect(imageFileService.storeImageFile).toHaveBeenCalledTimes(2);
    expect(imageFileService.storeImageFile).toHaveBeenCalledWith(
      mockUploadResults[0].Location,
      mockUploadResults[0].Key,
      activity.id,
      user,
    );
    expect(imageFileService.storeImageFile).toHaveBeenCalledWith(
      mockUploadResults[1].Location,
      mockUploadResults[1].Key,
      activity.id,
      user,
    );
  });

  it('returns all activities related to a user', async () => {
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(activityRepository, 'getAllUserActivities').mockResolvedValue(activities);
    const search = '';

    const { data } = await service.getAllUserActivities(user.email, search);

    expect(data).toEqual(returnedActivities);
  });

  it('returns an activity related to a user', async () => {
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(activityRepository, 'getActivityByUserIdAndActivityId').mockResolvedValue(activity);
    jest.spyOn(imageFileService, 'fetchImageFilesById').mockResolvedValue([]);

    const result = await service.getUserActivity(activity.id, user.email);
    expect(result).toEqual({
      id: activity.id,
      activityTitle: activity.activity_title,
      categoryName: activity.category.category_name,
      categoryId: activity.category.id,
      location: activity.location,
      price: activity.price,
      rating: activity.rating,
      description: activity.description,
      dateCreated: activity.date_created,
      dateUpdated: activity.date_updated,
      imageUrls: [],
    });
  });

  it('updates an activity', async () => {
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(activityRepository, 'getActivityByUserIdAndActivityId').mockResolvedValue(activity);
    jest.spyOn(categoryService, 'getCategoryByName').mockResolvedValue(category);
    jest.spyOn(categoryService, 'createCategory').mockResolvedValue(null);
    jest
      .spyOn(activityRepository, 'updateActivity')
      .mockResolvedValue({ ...activity, activity_title: 'Updated Sample' });

    jest.spyOn(categoryService, 'createCategory').mockResolvedValue(null);
    const updateDto = {
      activityTitle: 'Updated Sample',
      categoryName: 'test',
      description: 'Updated Description',
      rating: 4,
      price: 100,
    };

    await service.updateActivity(activity.id, updateDto, user.email, req.headers);
    expect(activityRepository.updateActivity).toHaveBeenCalled();
    expect(activityRepository.updateActivity).toHaveBeenCalledWith(
      activity,
      {
        activityTitle: 'Updated Sample',
        categoryName: 'test',
        description: 'Updated Description',
        price: 100,
        rating: 4,
      },
      category.id,
    );
  });

  it('updates an activity with image files', async () => {
    const updateDto = {
      activityTitle: 'Updated Activity with Images',
      categoryName: 'test',
      description: 'Updated Description with images',
      rating: 4,
      price: 150,
    };

    const mockFiles: Express.Multer.File[] = [
      {
        fieldname: 'files',
        originalname: 'updated-image-1.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('fake-updated-image-data-1'),
        size: 1536,
      } as Express.Multer.File,
      {
        fieldname: 'files',
        originalname: 'updated-image-2.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('fake-updated-image-data-2'),
        size: 2560,
      } as Express.Multer.File,
    ];

    const mockUploadResults = [
      {
        Location:
          'https://s3.amazonaws.com/bucket/users/user-id/activities/1/uuid-updated-image-1.jpg',
        Key: 'users/user-id/activities/1/uuid-updated-image-1.jpg',
        ETag: '"etag-updated-1"',
        Bucket: 'bucket',
      },
      {
        Location:
          'https://s3.amazonaws.com/bucket/users/user-id/activities/1/uuid-updated-image-2.png',
        Key: 'users/user-id/activities/1/uuid-updated-image-2.png',
        ETag: '"etag-updated-2"',
        Bucket: 'bucket',
      },
    ];

    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(activityRepository, 'getActivityByUserIdAndActivityId').mockResolvedValue(activity);
    jest.spyOn(categoryService, 'getCategoryByName').mockResolvedValue(category);
    jest
      .spyOn(activityRepository, 'updateActivity')
      .mockResolvedValue({ ...activity, activity_title: updateDto.activityTitle });

    jest
      .spyOn(uploadService, 'upload')
      .mockResolvedValueOnce(mockUploadResults[0])
      .mockResolvedValueOnce(mockUploadResults[1]);

    jest.spyOn(imageFileService, 'storeImageFile').mockResolvedValue(undefined);

    await service.updateActivity(activity.id, updateDto, user.email, req.headers, mockFiles);

    expect(activityRepository.updateActivity).toHaveBeenCalled();
    expect(uploadService.upload).toHaveBeenCalledTimes(2);
    expect(uploadService.upload).toHaveBeenCalledWith({
      file: mockFiles[0],
      userId: user.id,
      activityId: activity.id,
    });
    expect(uploadService.upload).toHaveBeenCalledWith({
      file: mockFiles[1],
      userId: user.id,
      activityId: activity.id,
    });
    expect(imageFileService.storeImageFile).toHaveBeenCalledTimes(2);
    expect(imageFileService.storeImageFile).toHaveBeenCalledWith(
      mockUploadResults[0].Location,
      mockUploadResults[0].Key,
      activity.id,
      user,
    );
    expect(imageFileService.storeImageFile).toHaveBeenCalledWith(
      mockUploadResults[1].Location,
      mockUploadResults[1].Key,
      activity.id,
      user,
    );
  });

  it('allows admin to create more than 10 activities regardless of subscription status', async () => {
    const adminUser = {
      ...user,
      role: 'admin',
    };

    const activityData: CreateActivityDto = {
      activityTitle: 'Test Activity 11',
      categoryName: 'category',
      description: 'This is the 11th activity',
      rating: 0,
    };

    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(adminUser);
    jest.spyOn(usersService, 'findUserRoleById').mockResolvedValue('admin');
    jest.spyOn(activityRepository, 'count').mockResolvedValue(10);
    jest.spyOn(categoryService, 'getCategoryByName').mockResolvedValue(category);
    jest.spyOn(activityRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(activityRepository, 'create').mockReturnValue(activity);
    jest.spyOn(activityRepository, 'save').mockResolvedValue(activity);

    const result = await service.createActivity(adminUser.email, activityData, req.headers);

    expect(result).toEqual(activity);
    expect(activityRepository.save).toHaveBeenCalled();
  });

  it('prevents regular users from creating more than 10 activities without an active subscription', async () => {
    const regularUser = {
      ...user,
      role: 'user',
    };

    const activityData: CreateActivityDto = {
      activityTitle: 'Test Activity 11',
      categoryName: 'category',
      description: 'This is the 11th activity',
      rating: 0,
    };

    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(regularUser);
    jest.spyOn(usersService, 'findUserRoleById').mockResolvedValue(regularUser.role);
    jest.spyOn(activityRepository, 'count').mockResolvedValue(10);
    jest.spyOn(service['subscriptionService'], 'getActiveSubscription').mockResolvedValue(null);

    await expect(
      service.createActivity(regularUser.email, activityData, req.headers),
    ).rejects.toThrow('Upgrade required to create more activities.');

    expect(activityRepository.save).not.toHaveBeenCalled();
  });

  it('allows regular users with customUsers role to create more than 10 activities', async () => {
    const regularUser = {
      ...user,
      role: 'customUsers',
    };

    const activityData: CreateActivityDto = {
      activityTitle: 'Test Activity 11',
      categoryName: 'category',
      description: 'This is the 11th activity',
      rating: 0,
    };

    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(regularUser);
    jest.spyOn(usersService, 'findUserRoleById').mockResolvedValue(regularUser.role);
    jest.spyOn(activityRepository, 'count').mockResolvedValue(10);
    jest.spyOn(service['subscriptionService'], 'getActiveSubscription').mockResolvedValue(null);

    // jest
    //   .spyOn(service['subscriptionService'], 'getActiveSubscription')
    //   .mockResolvedValue({ id: 'sub_123', plan: 'pro', status: 'active' });
    jest.spyOn(categoryService, 'getCategoryByName').mockResolvedValue(category);
    jest.spyOn(activityRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(activityRepository, 'create').mockReturnValue(activity);
    jest.spyOn(activityRepository, 'save').mockResolvedValue(activity);

    const result = await service.createActivity(regularUser.email, activityData, req.headers);

    expect(result).toEqual(activity);
    expect(activityRepository.save).toHaveBeenCalled();
  });

  it('deletes activity', async () => {
    jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(activityRepository, 'getActivityByUserIdAndActivityId').mockResolvedValue(activity);
    jest.spyOn(activityRepository, 'delete').mockResolvedValue(undefined);

    await service.deleteActivity(activity.id, user.email);

    expect(activityRepository.delete).toHaveBeenCalledWith({ id: activity.id });
  });
});
