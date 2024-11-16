import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../user-service/users.service';
import { UserAccountRepository } from '../../repositories/user-account.repository';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserAccountRepository,
          useValue: {
            findOne: jest.fn(),
            findUserByEmail: jest.fn(),
            findUserById: jest.fn(),
            getUserDetail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
