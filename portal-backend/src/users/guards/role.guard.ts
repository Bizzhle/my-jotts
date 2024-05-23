import { CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { UserRole } from '../enums/roles.enum';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      return false; // No user, deny access
    }

    return requiredRoles.some((role) => user.role.includes(role));
    // return roles.includes(user.role); // Check if user's role has access
  }
}

export function CheckRole() {
  return UseGuards(RolesGuard);
}
