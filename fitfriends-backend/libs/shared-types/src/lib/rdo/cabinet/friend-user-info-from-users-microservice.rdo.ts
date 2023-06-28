import { Expose, Transform } from "class-transformer";

import { InternalServerErrorException, Logger } from '@nestjs/common';

import { TrainingType } from "@fitfriends-backend/shared-types";


export class FriendUserInfoRdoFromUsersMicroservice {
  @Expose()
  @Transform(({ value, obj }) => {
    try {
      return obj._id.toString();
    } catch {
      return value;
    }
  })
  id: string;

  @Expose()
  name: string;

  @Expose()
  trainingType: TrainingType[];

  @Expose()
  @Transform(({ obj }) => {
    if ('trainingIsReady' in obj) {
      return obj['trainingIsReady'];
    } else if ('personalTraining' in obj) {
      return obj['personalTraining'];
    }

    Logger.log('Не получены данные из БД по поводу готовности к тренировки.');
    throw new InternalServerErrorException('Внутренняя ошибка сервера при трансформации данных пользователя. Повторите запрос еще раз.');
  })
  isReadyTraining: boolean;

}
