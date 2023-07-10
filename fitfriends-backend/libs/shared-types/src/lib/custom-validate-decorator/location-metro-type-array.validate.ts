import { LocationMetroEnum, TrainingType } from "@fitfriends-backend/shared-types";
import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, isEnum, registerDecorator } from "class-validator";

const VALIDATOR_NAME = 'LocationMetroTypeArrayValidator';

@ValidatorConstraint({ name: VALIDATOR_NAME, async: true, })
class LocationMetroTypeArrayValidator implements ValidatorConstraintInterface {
  async validate(array: TrainingType[]): Promise<boolean> {

    for (let index = 0; index < array.length; index++) {
      const isValidate = isEnum(array[index], LocationMetroEnum);

      if (!isValidate) {
        return false;
      }
    }

    return true;
  }

}

export function IsLocationMetroTypeArrayValidator(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: VALIDATOR_NAME,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: LocationMetroTypeArrayValidator,
    });
  };
}

