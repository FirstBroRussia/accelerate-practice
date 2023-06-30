import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { isEnum } from 'class-validator';
import { UserRoleEnum } from '../enum/users/user-role.enum';

const BAD_USER_ROLE_ERROR = 'Некорректный тип пользователя';


@Injectable()
export class UserRoleValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') {
      throw new Error('Данный pipe только для query параметра!');
    }

    if (!isEnum(value, UserRoleEnum)) {
      throw new BadRequestException(BAD_USER_ROLE_ERROR);
    }


    return value;
  }
}

