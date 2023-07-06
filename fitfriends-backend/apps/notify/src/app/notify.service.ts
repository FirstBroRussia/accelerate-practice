import { Injectable, Logger } from '@nestjs/common';
import { NotifyRepositoryService } from './notify-repository/notify-repository.service';
import { NotifyEntity } from './notify-repository/entity/notify.entity';
import { CreateNotifyForNotifyMicroservice, GetNotifyDto, RemoveNotifyDto } from '@fitfriends-backend/shared-types';
import { NodemailerService } from './nodemailer/nodemailer.service';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class NotifyService {
  private readonly logger = new Logger(NotifyService.name);

  constructor (
    private readonly notifyRepository: NotifyRepositoryService,
    private readonly nodemailerService: NodemailerService,
  ) { }


  public async getNotify(dto: GetNotifyDto): Promise<{ notifications: NotifyEntity[], creatorUserIds: string[], }> {
    const { targetUserId } = dto;

    return await this.notifyRepository.getNotifyByTargetUserId(targetUserId);
  }

  public async removeNotify(dto: RemoveNotifyDto): Promise<{}> {
    const { notifyId, targetUserId } = dto;


    const result = await this.notifyRepository.removeNotifyByIdAndTargetUserId(notifyId, targetUserId);

    if (!result) {
      throw new RpcException('Невозможно далить, записи не существует.');
    }

    this.logger.log('Произведено удаление оповещения.');

    return {};
  }

  public async createNotify(dto: CreateNotifyForNotifyMicroservice): Promise<void> {
    const { message } = dto;

    const result = await this.notifyRepository.createNotify(dto);

    this.logger.log('Создано новое оповещение.');

    switch (message) {
      case 'AddFriend': {
        return this.nodemailerService.sendNotifyAddFriend(dto);
      }
      case 'RequestTrainingToStudentUser': {
        return this.nodemailerService.sendNotifyRequestTrainingToStudentUser(dto);
      }
      case 'RequestCoachTraining': {
        return this.nodemailerService.sendNotifyRequestCoachTraining(dto);
      }
    }
  }

}
