import { NotifyMessageEnum, NotifyMessageType } from "@fitfriends-backend/shared-types";
import { NotifyInterface } from "../../interface/notify/notify.interface";
import { IsEmail, IsEnum, IsMongoId, IsNotEmpty } from "class-validator";
import { Expose } from "class-transformer";


export class CreateNotifyForNotifyMicroservice implements NotifyInterface {
  @Expose()
  @IsNotEmpty()
  @IsMongoId()
  creatorUserId: string;

  @Expose()
  @IsNotEmpty()
  @IsMongoId()
  targetUserId: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  userEmail: string;

  @Expose()
  @IsNotEmpty()
  @IsEnum(NotifyMessageEnum)
  message: NotifyMessageType;
}
