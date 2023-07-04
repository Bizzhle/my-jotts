import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException(' cant');
    }
    return user;
  }
  // add custom authentication logic here
  // canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
  //   return super.canActivate(context);
  //   // const request = context.switchToHttp().getRequest();
  //   // return request.isAuthenticated();
  // }
  // handleRequest<TUser = any>(
  //   err: any,
  //   user: any,
  //   info: any,
  //   context: ExecutionContext,
  //   status?: any,
  // ): TUser {
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}
