import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, isEnum, registerDecorator } from "class-validator";
import { TrainingType } from "../type/users/training-type.type";
import { TrainingTypeEnum } from "../enum/users/training-type.enum";


@ValidatorConstraint({ name: 'TrainingTypeArrayValidator', async: true, })
class TrainingTypeArrayValidator implements ValidatorConstraintInterface {
  async validate(array: TrainingType[]): Promise<boolean> {

    for (let index = 0; index < array.length; index++) {
      const isValidate = isEnum(array[index], TrainingTypeEnum);

      if (!isValidate) {
        return false;
      }
    }

    return true;
  }

}

export function IsTrainingTypeArrayValidator(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'TrainingTypeArrayValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: TrainingTypeArrayValidator,
    });
  };
}

