import { NotifyInterface, NotifyMessageType, StudentUserRdo } from "@fitfriends-backend/shared-types";
import { Expose, Transform, Type } from "class-transformer";


export class NotifyRdo implements NotifyInterface {
  @Expose()
  @Transform(({ value, obj }) => {
    try {
      return obj._id.toString();
    } catch {
      return value;
    }
  })
  id: string;

  @Expose()
  message?: NotifyMessageType;

  @Expose()
  @Type(() => StudentUserRdo)
  userInfo: StudentUserRdo;

  @Expose()
  createdAt?: string;
}
