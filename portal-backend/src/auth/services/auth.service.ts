import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { auth } from '../../../auth';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { UserAccountRepository } from '../../users/repositories/user-account.repository';
import { ForgotPasswordDto, ResetPasswordDto } from '../dtos/forgot-password.dto';
import { SignInDto } from '../dtos/signin.dto';
import { SignUpDto } from '../dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserAccountRepository,
    private readonly appLogger: AppLoggerService,
  ) {}

  private applyAuthHeaders(response: Response, headers?: Headers) {
    if (!headers) {
      return;
    }

    const setCookies = typeof headers.getSetCookie === 'function' ? headers.getSetCookie() : [];
    if (setCookies.length > 0) {
      response.append('Set-Cookie', setCookies);
    }

    headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        return;
      }
      response.setHeader(key, value);
    });
  }

  private toHeaders(headers: IncomingHttpHeaders): Headers {
    const requestHeaders = new Headers();

    Object.entries(headers).forEach(([key, value]) => {
      if (typeof value === 'undefined') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((entry) => requestHeaders.append(key, entry));
        return;
      }

      requestHeaders.set(key, value);
    });

    return requestHeaders;
  }

  private isUnauthorizedApiError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const apiError = error as {
      status?: string;
      statusCode?: number;
      body?: { code?: string };
    };

    return (
      apiError.status === 'UNAUTHORIZED' ||
      apiError.statusCode === 401 ||
      apiError.body?.code === 'UNAUTHORIZED'
    );
  }

  private isBetterAuthApiError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const apiError = error as {
      status?: unknown;
      statusCode?: unknown;
      body?: { code?: unknown };
    };

    return (
      typeof apiError.status === 'string' ||
      typeof apiError.statusCode === 'number' ||
      typeof apiError.body?.code === 'string'
    );
  }

  async signup(dto: SignUpDto) {
    const { email, password, name } = dto;
    try {
      const existing = await this.userRepository.findOne({ where: { email } });
      if (existing) {
        throw new ConflictException('User already exists');
      }

      await auth.api.signUpEmail({
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

  async signin(dto: SignInDto, response: Response) {
    const { email, password } = dto;

    try {
      const result = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
        returnHeaders: true,
      });

      this.applyAuthHeaders(response, result.headers);

      return {
        email: result.response.user.email,
        token: result.response.token,
      };
    } catch (error) {
      if (this.isUnauthorizedApiError(error)) {
        throw new UnauthorizedException('Invalid email or password');
      }

      this.appLogger.error('Signin failed', error);
      throw new InternalServerErrorException('Unable to sign in right now');
    }
  }

  async getUserData(email: string) {
    try {
      const result = await this.userRepository.findOneBy({
        email,
      });

      if (!result) {
        throw new NotFoundException('User does not exist');
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.appLogger.error('Failed to fetch user data', error);
      throw new InternalServerErrorException('Unable to fetch user data');
    }
  }

  async signout(headers: IncomingHttpHeaders, response: Response) {
    const result = await auth.api.signOut({
      headers: this.toHeaders(headers),
      returnHeaders: true,
    });

    this.applyAuthHeaders(response, result.headers);

    return { message: 'Signed out successfully' };
  }

  async validateUser(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      await auth.api.sendVerificationEmail({
        body: { email },
      });

      return { message: 'Verification email sent' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (this.isUnauthorizedApiError(error)) {
        throw new UnauthorizedException('Unable to validate user');
      }

      this.appLogger.error('Failed to validate user', error);
      throw new InternalServerErrorException('Unable to validate user');
    }
  }
  async requestResetPassword(dto: ForgotPasswordDto) {
    const { email } = dto;

    try {
      await auth.api.requestPasswordReset({
        body: {
          email,
          redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
        },
      });
    } catch (error) {
      if (!this.isBetterAuthApiError(error)) {
        this.appLogger.error('Failed to request password reset', error);
        throw new InternalServerErrorException('Unable to process reset request');
      }
    }

    // Always return the same response to avoid account enumeration.
    return { message: 'If an account exists, a password reset email has been sent' };
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

      return {
        success: true,
        data: result,
        error: null,
        message: 'Password reset successfully',
      };
    } catch (error) {
      this.appLogger.verbose('Password reset failed', error);
      if (this.isUnauthorizedApiError(error)) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }

      throw new InternalServerErrorException('Unable to reset password right now');
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
      if (error instanceof HttpException) {
        throw error;
      }

      if (this.isUnauthorizedApiError(error)) {
        throw new BadRequestException('Invalid or expired verification token');
      }

      this.appLogger.error('Email verification failed', error);
      throw new InternalServerErrorException('Unable to verify email right now');
    }
  }
}
