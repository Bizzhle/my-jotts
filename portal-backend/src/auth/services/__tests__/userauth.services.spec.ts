import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PasswordResetToken } from '../../../users/entities/password-reset-token.entity';
import { UserAccountRepository } from '../../../users/repositories/user-account.repository';
import { UsersService } from '../../../users/services/user-service/users.service';
import { UserSessionService } from '../../../users/services/user-session/user-session.service';
import { MailerService } from '../../../utils/services/mailer.services';
import { AuthService } from '../auth.service';
import { PasswordService } from '../password.service';

jest.mock('../../../../auth', () => ({
  auth: {
    api: {
      signUpEmail: jest.fn(),
      signInEmail: jest.fn(),
    },
  },
}));

describe('User Authentication', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserAccountRepository,
          useValue: {},
        },
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

    service = module.get<AuthService>(AuthService);
  });

  it('logs a user in', async () => {});
});
