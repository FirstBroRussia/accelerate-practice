import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

const BAD_MONGOID_ERROR = 'Невалидный MongoID';


@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if (metadata.type !== 'param') {
      throw new Error('This pipe must used only with params!');
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`В переданном параметре ${metadata.data} ${BAD_MONGOID_ERROR}`);
    }


    return value;
  }
}
