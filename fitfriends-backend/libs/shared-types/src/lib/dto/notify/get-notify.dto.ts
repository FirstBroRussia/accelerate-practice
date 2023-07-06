import { NotifyInterface } from "@fitfriends-backend/shared-types";
import { Expose } from "class-transformer";
import { IsMongoId, IsNotEmpty } from "class-validator";


export class GetNotifyDto implements NotifyInterface {
  @Expose()
  @IsNotEmpty()
  @IsMongoId()
  targetUserId: string;
}
