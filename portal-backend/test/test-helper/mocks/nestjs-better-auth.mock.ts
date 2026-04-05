import { DynamicModule, Module } from '@nestjs/common';

export function AllowAnonymous(): MethodDecorator {
  return () => {
    return;
  };
}

@Module({})
class MockAuthModule {
  static forRoot(_: unknown): DynamicModule {
    return {
      module: MockAuthModule,
    };
  }
}

export { MockAuthModule as AuthModule };
