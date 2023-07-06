import { NotifyInterface, NotifyMessageType, StudentUserRdo } from "@fitfriends-backend/shared-types";
import { Expose, Type } from "class-transformer";


export class NotifyRdo implements NotifyInterface {
  @Expose()
  message?: NotifyMessageType;

  @Expose()
  @Type(() => StudentUserRdo)
  userInfo: StudentUserRdo;

  @Expose()
  createdAt?: string;
}
