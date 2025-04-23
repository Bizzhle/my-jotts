import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PasswordResetToken } from '../../../users/entities/password-reset-token.entity';
import { UsersService } from '../../../users/services/user-service/users.service';
import { UserSessionService } from '../../../users/services/user-session/user-session.service';
import { MailerService } from '../../../utils/services/mailer.services';
import { PasswordService } from '../password.service';
import { UserAuthService } from '../userauth.service';

describe('User Authentication', () => {
  let service: UserAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn(),
            getUserById: jest.fn(),
            updateUserPassword: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            verifyPassword: jest.fn(),
            encryptPassword: jest.fn(),
          },
        },
        {
          provide: UserSessionService,
          useValue: {
            generateToken: jest.fn(),
            getValidSessionbyRefreshToken: jest.fn(),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendPasswordResetEmail: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PasswordResetToken),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserAuthService>(UserAuthService);
  });

  it('logs a user in', async () => {});
});
