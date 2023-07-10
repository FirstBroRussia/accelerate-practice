import { BffMicroserviceConstant, CreateNotifyForNotifyMicroservice, GetNotifyDto, NotifyFromNotifyMicroserviceRdo, NotifyMessageEnum, RemoveNotifyDto } from '@fitfriends-backend/shared-types';
import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';


@Injectable()
export class NotifyMicroserviceClientService {
  constructor (
    @Inject(BffMicroserviceConstant.NOTIFY_MICROSERVICE_CLIENT) private readonly notifyRabbitMqClient: ClientRMQ,
  ) { }


  public async addFriendEvent(dto: CreateNotifyForNotifyMicroservice): Promise<void> {
    this.notifyRabbitMqClient.emit(NotifyMessageEnum.AddFriend, dto);
  }

  public async requestTrainingToStudentUserEvent(dto: CreateNotifyForNotifyMicroservice): Promise<void> {
    this.notifyRabbitMqClient.emit(NotifyMessageEnum.RequestTrainingToStudentUser, dto);
  }

  public async requestCoachTrainingEvent(dto: CreateNotifyForNotifyMicroservice): Promise<void> {
    this.notifyRabbitMqClient.emit(NotifyMessageEnum.RequestCoachTraining, dto);
  }

  public async getNotify(creatorUserId: string): Promise<NotifyFromNotifyMicroserviceRdo> {
    const dto: GetNotifyDto = {
      targetUserId: creatorUserId,
    };


    return await new Promise((resolve, reject) => {
      this.notifyRabbitMqClient.send(NotifyMessageEnum.GetNotify, dto).subscribe({
        next: (rdo: NotifyFromNotifyMicroserviceRdo) => {
          resolve(rdo);
        },
        error: (error: unknown) => {
          reject(error);
        }
      });
    })
  }

  public async removeNotify(notifyId: string, creatorUserId: string): Promise<void> {
    const dto: RemoveNotifyDto = {
      targetUserId: creatorUserId,
      notifyId: notifyId,
    };


    return await new Promise((resolve, reject) => {
      this.notifyRabbitMqClient.send(NotifyMessageEnum.RemoveNotify, dto).subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

}
