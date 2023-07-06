import { Document } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { CommentInterface, CreateCommentForCommentsMicroserviceDto } from "@fitfriends-backend/shared-types";


export interface CommentEntity extends Document { }


@Schema({
  collection: 'comments',
  timestamps: true,
})
export class CommentEntity implements CommentInterface {
  @Prop({
    required: true,
    trim: true,
    index: true
  })
  creatorUserId?: string;

  @Prop({
    required: true,
    trim: true,
    index: true
  })
  trainingId?: string;

  @Prop({
    required: true,
    trim: true,
    index: true
  })
  orderId?: string;

  @Prop({
    required: true,
    trim: true,
  })
  score?: number;

  @Prop({
    required: true,
    trim: true,
  })
  description?: string;


  public fillObject(dto: CreateCommentForCommentsMicroserviceDto): this {
    const { creatorUserId, trainingId, score, description, orderId } = dto;

    this.creatorUserId = creatorUserId;
    this.trainingId = trainingId;
    this.score = score;
    this.description = description;

    this.orderId = orderId;


    return this;
  }
}

export const CommentEntitySchema = SchemaFactory.createForClass(CommentEntity);
