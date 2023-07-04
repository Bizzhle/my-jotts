import { ExecutionContext, createParamDecorator } from '@nestjs/common';

function JwtFielDecorator(field: string) {
  return createParamDecorator((data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.context.payload) {
      return;
    }

    return request.context.tokenPayload[field];
  });
}
