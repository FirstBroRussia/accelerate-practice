import { CommentInterface, StudentUserRdo } from "@fitfriends-backend/shared-types";
import { Expose, Transform } from "class-transformer";


export class CommentRdo implements CommentInterface {
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
  userInfo: StudentUserRdo;

  @Expose()
  trainingId: string;

  @Expose()
  score: number;

  @Expose()
  description: string;

  @Expose()
  createdAt: string;
}
