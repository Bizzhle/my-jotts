import { User } from '../../../src/users/entities/User.entity';
import { TestDatabase } from '../database';
import { db } from '../setupTest';

export interface Activity {
  id: string;
  activityTitle: string;
  categoryName: string;
  description: string;
  rating: number;
  price: number;
  location: string;
}

export const createActivityPayload = {
  activityTitle: `e2e-activity-${Date.now()}`,
  categoryName: `e2e-category-${Date.now()}`,
  description: 'A fun activity to do',
  rating: 4,
  price: 100,
  location: 'Lagos',
};

export const updateActivityPayload = {
  activityTitle: `e2e-activity-${Date.now()}-updated`,
  categoryName: `e2e-category-${Date.now()}-updated`,
  description: 'An updated fun activity to do',
  rating: 5,
  price: 150,
  location: 'Abuja',
};

export async function seedTestActivity(userEmail: string, overrides: Partial<Activity> = {}) {
  const testDatabase = new TestDatabase(db);
  const user = await db.getRepository(User).findOne({ where: { email: userEmail } });

  const category = await testDatabase.seedCategory(user.id);
  const activity = await testDatabase.seedActivity(user, category);
  return activity;
}
