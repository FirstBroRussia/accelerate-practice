import { validate } from 'class-validator';

import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, RpcException, Transport } from '@nestjs/microservices';


import { fillDTOWithExcludeExtraneousValues, fillRDO } from '@fitfriends-backend/core';
import { CreateNotifyForNotifyMicroservice, GetNotifyDto, NotifyFromNotifyMicroserviceRdo, NotifyMessageEnum, RemoveNotifyDto } from '@fitfriends-backend/shared-types';

import { NotifyService } from './notify.service';


@Controller()
export class NotifyController {
  private readonly logger = new Logger(NotifyController.name);

  constructor(
    private readonly notifyService: NotifyService,
  ) { }


  @EventPattern(NotifyMessageEnum.AddFriend, Transport.RMQ)
  public async handleAddFriendEvent(dto: CreateNotifyForNotifyMicroservice) {
    return await this.notifyService.createNotify(dto);
  }

  @EventPattern(NotifyMessageEnum.RequestTrainingToStudentUser, Transport.RMQ)
  public async handleRequestTrainingToStudentUserEvent(dto: CreateNotifyForNotifyMicroservice) {
    return await this.notifyService.createNotify(dto);
  }

  @EventPattern(NotifyMessageEnum.RequestCoachTraining, Transport.RMQ)
  public async handleRequestCoachTrainingEvent(dto: CreateNotifyForNotifyMicroservice) {
    return await this.notifyService.createNotify(dto);
  }


  @MessagePattern(NotifyMessageEnum.GetNotify, Transport.RMQ)
  public async getNotify(dto: GetNotifyDto): Promise<NotifyFromNotifyMicroserviceRdo> {
    const transformDto = fillDTOWithExcludeExtraneousValues(GetNotifyDto, dto);

    const errors = await validate(transformDto);

    if (errors.length > 0) {
      throw new RpcException(errors.toString());
    }

    const result = await this.notifyService.getNotify(transformDto);

    if (!result) {
      return {
        notifications: [],
        creatorUserIds: [],
      };
    }

    return fillRDO(NotifyFromNotifyMicroserviceRdo, result) as unknown as NotifyFromNotifyMicroserviceRdo;
  }

  @MessagePattern(NotifyMessageEnum.RemoveNotify, Transport.RMQ)
  public async removeNotify(dto: RemoveNotifyDto): Promise<{}> {
    const transformDto = fillDTOWithExcludeExtraneousValues(RemoveNotifyDto, dto);

    const errors = await validate(transformDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors.toString());
    }

    return await this.notifyService.removeNotify(transformDto);
  }

}
