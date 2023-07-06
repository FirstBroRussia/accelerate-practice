import { RequestTrainingStatusType } from "@fitfriends-backend/shared-types";
import { RequestTrainingInterface } from "../../interface/users/request-training.interface";
import { Expose, Transform } from "class-transformer";


export class RequestTrainingInfoDto implements RequestTrainingInterface {
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
  status: RequestTrainingStatusType;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
