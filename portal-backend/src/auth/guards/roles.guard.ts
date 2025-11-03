import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly requiredRoles: string[] = []) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req['user']; // BetterAuth attaches the authenticated user here

    if (!user || !user.role) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!this.requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
export function IsAllowedUser() {
  return UseGuards(RolesGuard);
}
