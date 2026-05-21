import { Activity } from '../../src/activity/entities/activity.entity';
import { Category } from '../../src/category/entities/category.entity';
import { CategoryService } from '../../src/category/services/category.service';
import { seedTestActivity } from '../test-helper/factories/activity-factory';
import { seedTestUser } from '../test-helper/factories/user-factory';
import { patch, post, withAuth } from '../test-helper/request';
import { app, db } from '../test-helper/setupTest';

describe('ActivityController - Create Activity', () => {
  beforeAll(async () => {
    await seedTestUser({
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Custom Tester',
      email: 'custom-tester@example.com',
      role: 'customUser',
    });
    await seedTestUser({
      id: '33333333-3333-4333-8333-333333333333',
      name: 'Another Tester',
      email: 'another-tester@example.com',
      role: 'user',
    });
  });
  it('creates an activity for an authenticated user', async () => {
    const payload = {
      activityTitle: `e2e-activity-${Date.now()}`,
      categoryName: `e2e-category-${Date.now()}`,
      description: 'Created from e2e test',
      rating: 4,
      price: 120,
      location: 'Berlin',
    };

    const response = await withAuth(
      post('/api/v1/activities', payload),
      'custom-tester@example.com',
    ).expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        activityTitle: payload.activityTitle,
      }),
    );
  });

  it('returns 401 when creating an activity without authentication', async () => {
    const payload = {
      activityTitle: `e2e-unauth-activity-${Date.now()}`,
      categoryName: `e2e-unauth-category-${Date.now()}`,
      description: 'Unauthorized create attempt',
      rating: 4,
    };

    await post('/api/v1/activities', payload).expect(401);
  });

  it('returns error when user exceeds activity creation limit', async () => {
    const payload = {
      activityTitle: `e2e-limit-activity-${Date.now()}`,
      categoryName: `e2e-limit-category-${Date.now()}`,
      description: 'Testing activity creation limit',
      rating: 4,
    };

    // Simulate user reaching the activity creation limit
    await withAuth(post('/api/v1/activities', payload), 'custom-tester@example.com').expect(201);

    // Attempt to create one more activity beyond the limit
    await withAuth(post('/api/v1/activities', payload), 'custom-tester@example.com').expect(403);
  });

  it('returns error when creating an activity with more than allowed image uploads', async () => {
    // Minimal JPEG magic bytes — enough for the FileTypeValidator's mimetype check
    const fakeJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);

    // An unsubscribed 'user' role allows only minimumImageUploads (default: 1).
    // Attaching 2 files exceeds that limit → 403 ForbiddenException from the service.
    await withAuth(post('/api/v1/activities'), 'another-tester@example.com')
      .field('activityTitle', `e2e-image-limit-activity-${Date.now()}`)
      .field('categoryName', `e2e-image-limit-category-${Date.now()}`)
      .field('description', 'Testing image upload limit')
      .field('rating', '4')
      .attach('files', fakeJpeg, { filename: 'image1.jpg', contentType: 'image/jpeg' })
      .attach('files', fakeJpeg, { filename: 'image2.jpg', contentType: 'image/jpeg' })
      .expect(403);
  });

  it('allows maximum image uploads for an activity based on user subscription level', async () => {
    // Minimal JPEG magic bytes — enough for the FileTypeValidator's mimetype check
    const fakeJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);

    await withAuth(post('/api/v1/activities'), 'custom-tester@example.com')
      .field('activityTitle', `e2e-image-limit-activity-${Date.now()}`)
      .field('categoryName', `e2e-image-limit-category-${Date.now()}`)
      .field('description', 'Testing image upload limit')
      .field('rating', '4')
      .attach('files', fakeJpeg, { filename: 'image1.jpg', contentType: 'image/jpeg' })
      .attach('files', fakeJpeg, { filename: 'image2.jpg', contentType: 'image/jpeg' })
      .expect(201);
  });

  it('updates an existing activity for an authenticated user', async () => {
    const createPayload = {
      activityTitle: `e2e-update-activity-${Date.now()}`,
      categoryName: `e2e-update-category-${Date.now()}`,
      description: 'Initial description',
      rating: 3,
      price: 80,
      location: 'Lagos',
    };

    const created = await seedTestActivity('custom-tester@example.com', createPayload);

    const updatePayload = {
      activityTitle: `${createPayload.activityTitle}-updated`,
      categoryName: `${createPayload.categoryName}-updated`,
      description: 'Updated description',
      rating: 5,
      price: 150,
      location: 'Abuja',
      imagesToDelete: [],
    };

    await withAuth(
      patch(`/api/v1/activities/${created.id}/update`, updatePayload),
      'custom-tester@example.com',
    ).expect(200);
  });

  it('is idempotent when category creation fails while creating an activity', async () => {
    const categoryService = app.get(CategoryService);
    const createCategorySpy = jest
      .spyOn(categoryService, 'createCategory')
      .mockRejectedValueOnce(new Error('forced category failure'));

    const payload = {
      activityTitle: `e2e-idempotent-activity-${Date.now()}`,
      categoryName: `e2e-idempotent-category-${Date.now()}`,
      description: 'Should not persist when category creation fails',
      rating: 4,
      price: 120,
      location: 'Berlin',
    };

    try {
      await withAuth(post('/api/v1/activities', payload), 'another-tester@example.com').expect(400);

      const persistedActivity = await db.getRepository(Activity).findOne({
        where: { activity_title: payload.activityTitle },
      });
      const persistedCategory = await db.getRepository(Category).findOne({
        where: { category_name: payload.categoryName },
      });

      expect(persistedActivity).toBeNull();
      expect(persistedCategory).toBeNull();
    } finally {
      createCategorySpy.mockRestore();
    }
  });
});
