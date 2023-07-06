import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CommentsRepositoryService } from './comments-repository/comments-repository.service';
import { CreateCommentForCommentsMicroserviceDto, GetDocumentQuery } from '@fitfriends-backend/shared-types';
import { CommentEntity } from './comments-repository/entity/comment.entity';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor (
    private readonly commentsRepository: CommentsRepositoryService,
  ) { }


  public async createComment(dto: CreateCommentForCommentsMicroserviceDto): Promise<CommentEntity> {
    const { orderId, creatorUserId } = dto;

    const existComment = await this.commentsRepository.findCommentByOrderIdAndCreatorUserId(orderId, creatorUserId);

    if (existComment) {
      throw new BadRequestException('Вы уже оставляли комментарий к данной покупке.');
    }

    const result = await this.commentsRepository.createComment(dto);

    this.logger.log('Создан новый комментарий');


    return result;
  }

  public async findCommentsByTrainingId(trainingId: string, query: GetDocumentQuery): Promise<{ comments: CommentEntity[], creatorUserIds: string[], }> {
    return await this.commentsRepository.findCommentsByTrainingId(trainingId, query);
  }

}
