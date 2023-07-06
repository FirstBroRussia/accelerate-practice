import { Expose, Transform } from "class-transformer";

import { NotifyInterface, NotifyMessageType } from "@fitfriends-backend/shared-types";


export class BaseNotifyRdo implements NotifyInterface {
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
  creatorUserId: string;

  @Expose()
  targetUserId: string;

  @Expose()
  message: NotifyMessageType;

  @Expose()
  createdAt: string;
}
