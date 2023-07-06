import { Controller, Get, Post, Body, Logger, UseInterceptors, Param } from '@nestjs/common';

import { CommentService } from './comment.service';
import { CommentFromCommentsMicroserviceRdo, CommentsListFromCommentsMicroserviceRdo, CreateCommentForCommentsMicroserviceDto, GetDocumentQuery, MongoIdValidationPipe, TransformAndValidateDtoInterceptor } from '@fitfriends-backend/shared-types';
import { fillRDO } from '@fitfriends-backend/core';

@Controller('comments')
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(
    private readonly commentService: CommentService,
  ) { }


  @Post('/')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(CreateCommentForCommentsMicroserviceDto))
  public async createComment(@Body() dto: CreateCommentForCommentsMicroserviceDto): Promise<CommentFromCommentsMicroserviceRdo> {
    const result = await this.commentService.createComment(dto);


    return fillRDO(CommentFromCommentsMicroserviceRdo, result);
  }

  @Post(':trainingId')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(GetDocumentQuery, {
    isQueryDto: true,
  }))
  public async findCommentsByTrainingId(@Param('trainingId',MongoIdValidationPipe) trainingId: string, @Body() dto: GetDocumentQuery): Promise<CommentsListFromCommentsMicroserviceRdo> {
    const result = await this.commentService.findCommentsByTrainingId(trainingId, dto);


    return fillRDO(CommentsListFromCommentsMicroserviceRdo, result);
  }

}
