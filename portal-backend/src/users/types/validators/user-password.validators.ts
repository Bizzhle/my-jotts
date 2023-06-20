import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';

export class UserPasswordValidator implements ValidatorConstraintInterface {
  async validate(password: string, validationArguments?: ValidationArguments): Promise<boolean> {
    const regex = RegExp(
      '^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$',
    );

    return password.match(regex) !== null;
  }

  defaultMessage({ property }: ValidationArguments) {
    return `${property}.VALUE.INVALID`;
  }
}
