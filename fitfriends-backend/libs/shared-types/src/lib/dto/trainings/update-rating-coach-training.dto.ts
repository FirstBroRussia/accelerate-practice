import { Expose, Type } from "class-transformer";
import { IsInt, IsNotEmpty, Max, Min } from "class-validator";
import { TrainingsMicroserviceConstant } from "../../constant/trainings-microservice.constant";
import { ONE_VALUE } from "../../constant/common.constant";


export class UpdateRatingCoachTrainingDto {
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(ONE_VALUE)
  @Max(TrainingsMicroserviceConstant.TRAINING_RATING_MAX_COUNT)
  score: number;
}
