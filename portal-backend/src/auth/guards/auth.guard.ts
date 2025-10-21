import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req['user']; // BetterAuth attaches the authenticated user here

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return true;
  }
}
export function IsAuthorizedUser() {
  return UseGuards(AuthGuard);
}
