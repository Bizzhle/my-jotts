import { httpRequest, withAuth } from '../test-helper/auth';
import { getTestApp, seedTestUser } from '../test-helper/setupTest';

describe('ActivityController - Create Activity', () => {
  beforeAll(async () => {
    await seedTestUser({
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Custom Tester',
      email: 'custom-tester@example.com',
      role: 'customUser',
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

    const response = await withAuth()
      .post('/api/v1/activities', 'tester@example.com', payload)
      .expect(201);

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

    await httpRequest(getTestApp()).post('/api/v1/activities').send(payload).expect(401);
  });

  it('returns error when user exceeds activity creation limit', async () => {
    const payload = {
      activityTitle: `e2e-limit-activity-${Date.now()}`,
      categoryName: `e2e-limit-category-${Date.now()}`,
      description: 'Testing activity creation limit',
      rating: 4,
    };

    // Simulate user reaching the activity creation limit
    await withAuth().post('/api/v1/activities', 'tester@example.com', payload).expect(201);

    // Attempt to create one more activity beyond the limit
    await withAuth().post('/api/v1/activities', 'tester@example.com', payload).expect(403);
  });

  it('returns error when creating an activity with more than allowed image uploads', async () => {
    // Minimal JPEG magic bytes — enough for the FileTypeValidator's mimetype check
    const fakeJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);

    // An unsubscribed 'user' role allows only minimumImageUploads (default: 1).
    // Attaching 2 files exceeds that limit → 403 ForbiddenException from the service.
    await withAuth()
      .post('/api/v1/activities', 'tester@example.com')
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

    await withAuth()
      .post('/api/v1/activities', 'custom-tester@example.com')
      .field('activityTitle', `e2e-image-limit-activity-${Date.now()}`)
      .field('categoryName', `e2e-image-limit-category-${Date.now()}`)
      .field('description', 'Testing image upload limit')
      .field('rating', '4')
      .attach('files', fakeJpeg, { filename: 'image1.jpg', contentType: 'image/jpeg' })
      .attach('files', fakeJpeg, { filename: 'image2.jpg', contentType: 'image/jpeg' })
      .expect(201);
  });
});
