import { Expose, Transform, Type } from "class-transformer";

import { InternalServerErrorException, Logger } from '@nestjs/common';

import { RequestTrainingInfoDto, TrainingType, UserRoleType } from "@fitfriends-backend/shared-types";


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
  role: UserRoleType;

  @Expose()
  trainingType: TrainingType[];

  @Expose()
  @Transform(({ value, obj }) => {
    if ('trainingIsReady' in obj) {
      return obj['trainingIsReady'];
    } else if ('personalTraining' in obj) {
      return obj['personalTraining'];
    } else if ('isReadyTraining' in obj) {
      return value;
    }

    Logger.log('Не получены данные из БД по поводу готовности к тренировки.');
    throw new InternalServerErrorException('Внутренняя ошибка сервера при трансформации данных пользователя. Повторите запрос еще раз.');
  })
  isReadyTraining: boolean;

  @Expose()
  @Type(() => RequestTrainingInfoDto)
  requestTrainingInfo: RequestTrainingInfoDto;

}
