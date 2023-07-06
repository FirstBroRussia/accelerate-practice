import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentEntity } from './entity/comment.entity';
import { Model, QueryOptions } from 'mongoose';
import { CreateCommentForCommentsMicroserviceDto, DEFAULT_PAGINATION_LIMIT, GetDocumentQuery } from '@fitfriends-backend/shared-types';

@Injectable()
export class CommentsRepositoryService {
  private readonly logger = new Logger(CommentsRepositoryService.name);

  constructor (
    @InjectModel(CommentEntity.name) private readonly commentModel: Model<CommentEntity>,
  ) { }


  public async createComment(dto: CreateCommentForCommentsMicroserviceDto): Promise<CommentEntity> {
    const newCommentObj = new CommentEntity().fillObject(dto);


    return await this.commentModel.create(newCommentObj);
  }

  public async findCommentByOrderIdAndCreatorUserId(orderId: string, creatorUserId: string): Promise<CommentEntity | null> {
    return await this.commentModel.findOne({
      orderId: orderId,
      creatorUserId: creatorUserId,
    });
  }

  public async findCommentsByTrainingId(trainingId: string, query: GetDocumentQuery): Promise<{ comments: CommentEntity[], creatorUserIds: string[], }> {
    const { page, sort } = query;

    const result = await this.commentModel.aggregate([
      { $match: { trainingId: trainingId } },
      { $sort: { createdAt: sort === 'desc' ? -1 : 1 } },
      { $skip: DEFAULT_PAGINATION_LIMIT * (page - 1) },
      { $limit: DEFAULT_PAGINATION_LIMIT },
      { $group: {
        _id: null,
        comments: { $push: '$$ROOT' },
        creatorUserIds: { $addToSet: '$creatorUserId' },
      } },
      { $project: { _id: 0 } },
    ]);


    return result[0];
  }

}
