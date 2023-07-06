import { Expose, Type } from "class-transformer";
import { CommentFromCommentsMicroserviceRdo } from "@fitfriends-backend/shared-types";


export class CommentsListFromCommentsMicroserviceRdo {
  @Expose()
  @Type(() => CommentFromCommentsMicroserviceRdo)
  comments: CommentFromCommentsMicroserviceRdo[];

  @Expose()
  creatorUserIds: string[];
}
