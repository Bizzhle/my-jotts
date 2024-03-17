import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from '../service/activity.service';
import { ActivityController } from './activity.controller';

describe('FoodController', () => {
  let controller: ActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [ActivityService],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
