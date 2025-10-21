import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { auth } from 'auth';
import { User } from 'src/users/entities/User.entity';
import { UserAccountRepository } from 'src/users/repositories/user-account.repository';
import { ForgotPasswordDto, ResetPasswordDto } from '../dtos/forgot-password.dto';
import { SignInDto } from '../dtos/signin.dto';
import { SignUpDto } from '../dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserAccountRepository,
  ) {}

  async signup(dto: SignUpDto) {
    const { email, password, name } = dto;
    try {
      const existing = await this.userRepository.findOne({ where: { email } });
      if (existing) {
        throw new ConflictException('User already exists');
      }

      const betterAuth = await auth;

      await betterAuth.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
      });
      return { message: 'User registration successful' };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  async signin(dto: SignInDto) {
    const { email, password } = dto;
    const betterAuth = await auth;

    try {
      const result = await betterAuth.api.signInEmail({
        body: {
          email,
          password,
        },
        //   headers: await headers(),
      });

      return {
        email: result.user.email,
        token: result.token,
      };
    } catch (error) {
      throw new UnauthorizedException('User does not exist');
    }
  }

  async getUserData(email: string) {
    try {
      const result = await this.userRepository.findOneBy({
        email,
      });
      return result;
    } catch (error) {
      throw new UnauthorizedException('User does not exist');
    }
  }

  async signout(headers: HeadersInit) {
    const betterAuth = await auth;
    await betterAuth.api.signOut({
      headers,
    });

    return { message: 'Signed out successfully' };
  }

  async validateUser(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      const betterAuth = await auth;
      const result = await betterAuth.api.sendVerificationEmail({
        body: { email },
      });
      if (!result.status) {
        throw new BadRequestException('Invalid or expired token');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'User verification failed');
    }
  }
  async requestResetPassword(dto: ForgotPasswordDto) {
    const { emailAddress } = dto;
    const betterAuth = await auth;
    await betterAuth.api.requestPasswordReset({
      body: {
        email: emailAddress,
      },
    });
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;
    try {
      // 🔹 Complete reset using BetterAuth API
      const result = await auth.api.resetPassword({
        body: {
          token,
          newPassword: newPassword,
        },
      });

      if (!result.status) {
        throw new BadRequestException('Invalid or expired token');
      }

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Password reset failed');
    }
  }

  async verifyEmail(dto: ResetPasswordDto) {
    const { token } = dto;
    try {
      // 🔹 Complete reset using BetterAuth API
      const result = await auth.api.verifyEmail({
        query: {
          token,
        },
      });

      if (!result) {
        throw new BadRequestException('Invalid or expired token');
      }

      return { message: 'User verified' };
    } catch (error) {
      throw new BadRequestException(error.message || 'User verification failed failed');
    }
  }
}
