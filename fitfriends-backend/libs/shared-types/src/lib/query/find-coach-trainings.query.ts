import { Expose, Transform, Type } from "class-transformer";
import { CoachTrainingDurationType } from "../type/cabinet/coach-training-duration.type";
import { IsEnum, IsInt, Max, Min, isEnum } from "class-validator";
import { TrainingsMicroserviceConstant } from "../constant/trainings-microservice.constant";
import { CoachTrainingDurationEnum } from "../enum/cabinet/coach-training-duration.enum";
import { ONE_VALUE } from "../constant/common.constant";
import { AscDescSortEnum } from "../enum/common/asc-desc-sort.enum";
import { AscDescSortType } from "../type/common/asc-desc-sort.type";

export class FindCoachTrainingsQuery {
  @Expose()
  @Type(() => Number)
  @IsInt()
  @Min(TrainingsMicroserviceConstant.TRAINING_PRICE_MIN_COUNT)
  public minPrice?: number;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Min(TrainingsMicroserviceConstant.TRAINING_PRICE_MIN_COUNT)
  public maxPrice?: number;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Min(TrainingsMicroserviceConstant.TRAINING_CALORIES_MIN_COUNT)
  @Max(TrainingsMicroserviceConstant.TRAINING_CALORIES_MAX_COUNT)
  public minCalories?: number;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Min(TrainingsMicroserviceConstant.TRAINING_CALORIES_MIN_COUNT)
  @Max(TrainingsMicroserviceConstant.TRAINING_CALORIES_MAX_COUNT)
  public maxCalories?: number;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Min(TrainingsMicroserviceConstant.TRAINING_RATING_MIN_COUNT)
  @Max(TrainingsMicroserviceConstant.TRAINING_RATING_MAX_COUNT)
  public minRating?: number;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Min(TrainingsMicroserviceConstant.TRAINING_RATING_MIN_COUNT)
  @Max(TrainingsMicroserviceConstant.TRAINING_RATING_MAX_COUNT)
  public maxRating?: number;

  @Expose()
  @Type(() => String)
  @IsEnum(CoachTrainingDurationEnum)
  public duration?: CoachTrainingDurationType;

  @Expose()
  @Transform(({ value }) => {
    if (!value || isNaN(value) || value < ONE_VALUE) {
      return ONE_VALUE;
    }

    return value;
  })
  @Type(() => Number)
  @IsInt()
  @Min(ONE_VALUE)
  public page?: number;

  @Expose()
  @Transform(({value}) => {
    if (!value || !isEnum(value, AscDescSortEnum)) {
      return AscDescSortEnum.Desc;
    }

    return value;
  })
  @Type(() => String)
  @IsEnum(AscDescSortEnum)
  public sort?: AscDescSortType;

}
