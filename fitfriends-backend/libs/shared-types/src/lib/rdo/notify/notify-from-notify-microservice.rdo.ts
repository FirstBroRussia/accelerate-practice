import { Expose, Type } from "class-transformer";

import { BaseNotifyRdo } from "@fitfriends-backend/shared-types";


export class NotifyFromNotifyMicroserviceRdo {
  @Expose()
  @Type(() => BaseNotifyRdo)
  notifications: BaseNotifyRdo[];

  @Expose()
  creatorUserIds: string[];
}
