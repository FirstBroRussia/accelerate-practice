import { RequestTrainingInterface, RequestTrainingStatusEnum, RequestTrainingStatusType } from "@fitfriends-backend/shared-types";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export interface RequestTrainingEntity extends Document { }

@Schema({
  collection: 'requests_training',
  timestamps: true,
})
export class RequestTrainingEntity implements RequestTrainingInterface {
  @Prop({
    trim: true,
    required: true,
    index: true,
    type: String,
  })
  creatorUserId?: string;

  @Prop({
    trim: true,
    required: true,
    index: true,
    type: String,
  })
  targetUserId?: string;

  @Prop({
    trim: true,
    required: true,
    type: String,
  })
  status?: RequestTrainingStatusType;


  public fillObject(creatorUserId: string, targetUserId: string): this {
    this.creatorUserId = creatorUserId;
    this.targetUserId = targetUserId;
    this.status = RequestTrainingStatusEnum.Waiting;


    return this;
  }

}

export const RequestTrainingEntitySchema = SchemaFactory.createForClass(RequestTrainingEntity);
