import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import mongoose from 'mongoose';

@ValidatorConstraint({ name: 'isValidObjectId', async: false })
export class IsValidObjectIdConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return false;
    }
    if (args.constraints[0]) {
      const isRequired = args.constraints[0];
      if (isRequired && !value) {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Некорректный fileId';
  }
}

export function IsValidObjectId(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validationOptions && validationOptions.each ? true : false],
      validator: IsValidObjectIdConstraint,
    });
  };
}
