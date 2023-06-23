import { LocationMetroEnum, TrainingType, TrainingTypeEnum } from "@fitfriends-backend/shared-types";
import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, isEnum, registerDecorator } from "class-validator";


@ValidatorConstraint({ name: 'LocationMetroTypeArrayValidator', async: true, })
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
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'LocationMetroTypeArrayValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: LocationMetroTypeArrayValidator,
    });
  };
}

