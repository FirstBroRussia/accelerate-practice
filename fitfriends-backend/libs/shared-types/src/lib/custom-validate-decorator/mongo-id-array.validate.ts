import { TrainingType, TrainingTypeEnum } from "@fitfriends-backend/shared-types";
import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, isEnum, isMongoId, registerDecorator } from "class-validator";


@ValidatorConstraint({ name: 'MongoIdArrayValidator', async: true, })
class MongoIdArrayValidator implements ValidatorConstraintInterface {
  async validate(array: TrainingType[]): Promise<boolean> {

    for (let index = 0; index < array.length; index++) {
      const isValidate = isMongoId(array[index]);

      if (!isValidate) {
        return false;
      }
    }

    return true;
  }

}

export function IsMongoIdArrayValidator(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'MongoIdArrayValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: MongoIdArrayValidator,
    });
  };
}

