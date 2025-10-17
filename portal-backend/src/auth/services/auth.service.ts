import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { auth } from 'auth';
import { User } from 'src/users/entities/User.entity';
import { Repository } from 'typeorm';
import { SignInDto } from '../dtos/signin.dto';
import { SignUpDto } from '../dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async signup(dto: SignUpDto) {
    const { email, password, name } = dto;

    // const existing = await this.userRepo.findOne({ where: { email } });
    // if (existing) {
    //   throw new BadRequestException('User already exists');
    // }

    const betterAuth = await auth;

    const response = await betterAuth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    if (!response.user) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async signin(dto: SignInDto) {
    const { email, password } = dto;
    const betterAuth = await auth;

    const result = await betterAuth.api.signInEmail({
      body: {
        email,
        password,
      },
      //   headers: await headers(),
    });

    return result;
  }

  async signout(headers: HeadersInit) {
    const betterAuth = await auth;
    await betterAuth.api.signOut({
      headers,
    });

    return { message: 'Signed out successfully' };
  }

  async validateUser(email: string) {
    const betterAuth = await auth;
    await betterAuth.api.sendVerificationEmail({
      body: { email, callbackURL: '/' },
    });
  }
}
