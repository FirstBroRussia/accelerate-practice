import { Expose, Transform } from "class-transformer";

import { InternalServerErrorException, Logger } from '@nestjs/common';

import { TrainingType } from "@fitfriends-backend/shared-types";


export class FriendUserInfoRdo {
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
    if ((obj as Object).hasOwnProperty('trainingIsReady')) {
      return obj['trainingIsReady'];
    } else if ((obj as Object).hasOwnProperty('personalTraining')) {
      return obj['personalTraining'];
    }

    Logger.log('Не получены данные из БД по поводу готовности к тренировки.', FriendUserInfoRdo.name);

    throw new InternalServerErrorException('Внутренняя ошибка сервера. Повторите запрос еще раз.');
  })
  isReadyTraining: boolean;

}
