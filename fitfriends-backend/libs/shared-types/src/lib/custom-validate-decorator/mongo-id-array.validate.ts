import { TrainingType } from "@fitfriends-backend/shared-types";
import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, isMongoId, registerDecorator } from "class-validator";

const VALIDATOR_NAME = 'MongoIdArrayValidator';


@ValidatorConstraint({ name: VALIDATOR_NAME, async: true, })
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
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: VALIDATOR_NAME,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: MongoIdArrayValidator,
    });
  };
}

