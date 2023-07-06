import { CommentInterface, CommentsMicroserviceConstant } from "@fitfriends-backend/shared-types";
import { Expose, Type } from "class-transformer";
import { IsInt, IsMongoId, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from "class-validator";


export class CreateCommentForCommentsMicroserviceDto implements CommentInterface {
  @Expose()
  @IsNotEmpty()
  @Type(() => String)
  @IsMongoId()
  creatorUserId: string;

  @Expose()
  @IsNotEmpty()
  @Type(() => String)
  @IsMongoId()
  trainingId: string;

  @Expose()
  @IsNotEmpty()
  @Type(() => String)
  @IsMongoId()
  orderId: string;

  @Expose()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(CommentsMicroserviceConstant.SCORE_MIN_COUNT)
  @Max(CommentsMicroserviceConstant.SCORE_MAX_COUNT)
  score: number;

  @Expose()
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  @MinLength(CommentsMicroserviceConstant.DESCRIPTION_MIN_LENGTH)
  @MaxLength(CommentsMicroserviceConstant.DESCRIPTION_MAX_LENGTH)
  description: string;
}
