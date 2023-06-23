import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { isJWT } from 'class-validator';


@Injectable()
export class JwtValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      throw new Error('This pipe must used only with body!');
    }

    if (!isJWT(value)) {
      throw new BadRequestException('Переданный токен не является JWT');
    }


    return value;
  }
}

