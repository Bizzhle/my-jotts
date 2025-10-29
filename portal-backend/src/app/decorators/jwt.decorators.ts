import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * Generic decorator to pick a field from the BetterAuth user object
 */
function UserFieldDecorator(field: string) {
  return createParamDecorator((data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // BetterAuth attaches the authenticated user here

    if (!user) {
      return null; // or throw if you prefer: throw new UnauthorizedException()
    }

    return user[field];
  });
}

// Usage examples:

// Get the email address of the current authenticated user
export const GetCurrentUserEmail = UserFieldDecorator('email');

// Get UID
export const GetCurrentUserUid = UserFieldDecorator('uid');

// Get first name
export const GetCurrentUserFirstName = UserFieldDecorator('first_name');

// Get last name
export const GetCurrentUserLastName = UserFieldDecorator('last_name');

// Get any custom field
export const GetCurrentUserField = UserFieldDecorator;

// import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// function JwtFieldDecorator(field: string) {
//   return createParamDecorator((data: never, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();

//     return request.tokenPayload[field];
//   });
// }

// //get user emailaddress from jwt token
// export const GetCurrentUserFromJwt = JwtFieldDecorator('sub');

// export const GetJwtTokenUniqueIdFromJwt = JwtFieldDecorator('jti');

// export const GetTokenExpirationFromJWT = JwtFieldDecorator('exp');

// export const GetFirstNameFromJWT = JwtFieldDecorator('first_name');

// export const GetLastNameFromJWT = JwtFieldDecorator('last_name');

// export const GetUidFromJWT = JwtFieldDecorator('uid');

// export const GetEncodedTokenFromJWT = JwtFieldDecorator('encodedToken');
