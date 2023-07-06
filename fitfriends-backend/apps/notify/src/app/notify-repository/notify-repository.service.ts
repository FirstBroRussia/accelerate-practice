import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotifyEntity } from './entity/notify.entity';
import { Model } from 'mongoose';
import { CreateNotifyForNotifyMicroservice, NotifyMicroserviceConstant } from '@fitfriends-backend/shared-types';


@Injectable()
export class NotifyRepositoryService {
  private readonly logger = new Logger(NotifyRepositoryService.name);

  constructor (
    @InjectModel(NotifyEntity.name) private readonly notifyModel: Model<NotifyEntity>,
  ) { }


  public async getNotifyByTargetUserId(targetUserId: string): Promise<{ notifications: NotifyEntity[], creatorUserIds: string[], }> {
    const result = await this.notifyModel.aggregate([
      { $match: { targetUserId: targetUserId } },
      { $sort: { createdAt: -1 } },
      { $limit: NotifyMicroserviceConstant.DEFAULT_NOTIFY_DOCUMENT_LIMIT_COUNT },
      { $group: {
        _id: null,
        notifications: { $push: '$$ROOT' },
        creatorUserIds: { $addToSet: '$creatorUserId' },
      } },
      { $project: { _id: 0 } },
    ]);


    return result[0];
  }

  public async removeNotifyByIdAndTargetUserId(notifyId: string, targetUserId: string): Promise<NotifyEntity | null> {
    return await this.notifyModel.findOneAndDelete({
      _id: notifyId,
      targetUserId: targetUserId,
    });
  }

  public async createNotify(dto: CreateNotifyForNotifyMicroservice): Promise<NotifyEntity> {
    const newNotifyObj = new NotifyEntity().fillObject(dto);


    return await this.notifyModel.create(newNotifyObj);
  }

}
