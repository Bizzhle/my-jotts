import { Inject } from '@nestjs/common';
import { PROPERTY_DEPS_METADATA } from '@nestjs/common/constants';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from '../../envvars';

const CONFIG_SERVICE = Symbol();

type Constructor = new (...args: any) => any;
type EnvVarNamesOfType<T> = {
  [K in keyof EnvVars]: EnvVars[K] extends T ? K : never;
}[keyof EnvVars];

export type ConfigurationParserFn<T> = (value: string) => T;

export interface EnvGetArgs<T = unknown> {
  /**
   * The default value to use if the setting is not set
   */
  defaultValue?: T;
  /**
   * A parser function to cast/parse the setting to the desired target type.
   * The cast us not applied to default value
   */
  cast?: ConfigurationParserFn<T>;
}

/**
 * Injects the config service to the target class, if not already injected
 */
function injectConfigService(target: Constructor) {
  const alreadyInjected = Reflect.getMetadata(PROPERTY_DEPS_METADATA, target);
  if (!alreadyInjected) {
    Inject(ConfigService)(target, CONFIG_SERVICE);
  }
}

function getConfigValue<T>(
  configService: ConfigService,
  key: string,
  { defaultValue, cast }: EnvGetArgs<T>,
): T {
  const value: unknown =
    defaultValue === undefined ? configService.getOrThrow(key) : configService.get(key);

  if (!value) {
    return defaultValue as T;
  } else if (cast) {
    return cast(value as string);
  } else {
    return value as T;
  }
}

export const EnvGet = function <T>(key: string, args: EnvGetArgs<T> = {}): PropertyDecorator {
  return (target, property) => {
    injectConfigService(target as Constructor);

    const CACHE = Symbol();
    Object.defineProperty(target, property, {
      get(this: { [CONFIG_SERVICE]: ConfigService; [CACHE]?: T }) {
        if (!(CACHE in this)) {
          this[CACHE] = getConfigValue(this[CONFIG_SERVICE], key, args);
        }
        return this[CACHE];
      },
    });
  };
};

export const EnvGetBoolean = (key: EnvVarNamesOfType<boolean>, defaultValue = false) =>
  EnvGet(key, { defaultValue, cast: (value) => /^yes|true|on|1$/.test(value) });
export const EnvGetInt = (key: EnvVarNamesOfType<number>, defaultValue?: number) =>
  EnvGet(key, { defaultValue, cast: parseInt });
export const EnvGetString = (key: EnvVarNamesOfType<string>, defaultValue?: string) =>
  EnvGet(key, { defaultValue });
export const EnvGetFloat = (key: EnvVarNamesOfType<number>, defaultValue?: number) =>
  EnvGet(key, { defaultValue, cast: parseFloat });
