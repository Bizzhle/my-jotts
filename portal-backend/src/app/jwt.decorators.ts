import { ExecutionContext, createParamDecorator } from '@nestjs/common';

function JwtFieldDecorator(field: string) {
  return createParamDecorator((data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user[field];
  });
}

//get user emailaddress from jwt token
export const GetCurrentUserFromJwt = JwtFieldDecorator('sub');

export const GetJwtTokenUniqueIdFromJwt = JwtFieldDecorator('jti');

export const GetTokenExpirationFromJWT = JwtFieldDecorator('exp');

export const GetFirstNameFromJWT = JwtFieldDecorator('first_name');

export const GetLastNameFromJWT = JwtFieldDecorator('last_name');

export const GetUidFromJWT = JwtFieldDecorator('uid');
