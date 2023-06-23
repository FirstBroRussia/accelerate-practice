import { LogoutedUserDto } from "@fitfriends-backend/shared-types";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export interface LogoutedUserEntity extends Document { }


@Schema({
  collection: 'logouteduser',
  timestamps: true,
})
export class LogoutedUserEntity {
  @Prop({
    unique: true,
    required: true,
    trim: true,
    type: 'String',
  })
  refreshToken: string;

  @Prop({
    required: true,
    trim: true,
  })
  exp: number;


  public fillObject(dto: LogoutedUserDto): this {
    const { refreshToken, exp } = dto;

    this.refreshToken = refreshToken;
    this.exp = exp;


    return this;
  }

}

export const LogoutedUserEntitySchema = SchemaFactory.createForClass(LogoutedUserEntity);
