import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidPhoneArray', async: false })
export class IsValidPhoneArrayConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(phones: any[], args: ValidationArguments) {
    return phones.every((phone) => /^7\d{10}$/.test(phone));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return `Каждый телефон в массиве должен начинаться с «7» и иметь в общей сложности 11 цифр.`;
  }
}

export function IsValidPhoneArray(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPhoneArrayConstraint,
    });
  };
}
