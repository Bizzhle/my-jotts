import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@thallesp/nestjs-better-auth';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private readonly jwtSigningService: JwtSigningService) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request: RequestContext = context.switchToHttp().getRequest();
//     const token = await this.validateRequest(request);

//     try {
//       const payload = await this.jwtSigningService.verifyJwt(token);

//       request.tokenPayload = payload;
//       return true;
//     } catch (err) {
//       throw new UnauthorizedException('Invalid token credentials');
//     }
//   }

//   private async validateRequest(request: Request): Promise<string | undefined> {
//     const token = request.headers.authorization?.split(' ')[1];

//     if (!token) {
//       throw new UnauthorizedException('Invalid token');
//     }

//     return token;
//   }
// }

export function IsAuthorizedUser() {
  return UseGuards(AuthGuard);
}
