import { RequestTrainingInterface, RequestTrainingStatusType } from "@fitfriends-backend/shared-types";
import { Expose, Transform } from "class-transformer";


export class RequestTrainingRdo implements RequestTrainingInterface {
  @Expose()
  @Transform(({ value, obj }) => {
    if (!obj._id && value) {
      return value;
    } else {
      return obj._id.toString();
    }
  })
  id: string;

  @Expose()
  creatorUserId: string;

  @Expose()
  targetUserId: string;

  @Expose()
  status: RequestTrainingStatusType;

  @Expose()
  statusChangeDate: string;

  @Expose()
  createdAt: string;
}
