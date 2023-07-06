import { Document } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { CreateNotifyForNotifyMicroservice, NotifyInterface, NotifyMessageType } from "@fitfriends-backend/shared-types";


export interface NotifyEntity extends Document { }

@Schema({
  collection: 'notify',
  timestamps: true,
})
export class NotifyEntity implements NotifyInterface {
  @Prop({
    required: true,
    trim: true,
    index: true,
  })
  creatorUserId: string;

  @Prop({
    required: true,
    trim: true,
    index: true,
  })
  targetUserId: string;


  @Prop({
    required: true,
    trim: true,
    type: String,
  })
  message: NotifyMessageType;


  public fillObject(dto: CreateNotifyForNotifyMicroservice): this {
    const { creatorUserId, targetUserId, message } = dto;

    this.creatorUserId = creatorUserId;
    this.targetUserId = targetUserId;
    this.message = message;


    return this;
  }

}

export const NotifyEntitySchema = SchemaFactory.createForClass(NotifyEntity);
