import { Expose, Type } from "class-transformer";
import { CoachTrainingInterface } from "../../interface/cabinet/coach-training.interface";
import { GenderType } from "../../type/users/gender.type";
import { SkillLevelType } from "../../type/users/skill-level.type";
import { TimeForTrainingType } from "../../type/users/time-for-training.type";
import { TrainingType } from "../../type/users/training-type.type";
import { IsBoolean, IsEnum, IsInt, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { TrainingsMicroserviceConstant } from "../../constant/trainings-microservice.constant";
import { SkillLevelEnum } from "../../enum/users/skill-level.enum";
import { TrainingTypeEnum } from "../../enum/users/training-type.enum";
import { TimeForTrainingEnum } from "../../enum/users/time-for-training.enum";
import { GenderEnum } from "../../enum/users/gender.enum";


export class UpdateCoachTrainingDto implements CoachTrainingInterface {
  @Expose()
  @Type(() => String)
  @IsString()
  @MinLength(TrainingsMicroserviceConstant.TRAINING_NAME_MIN_LENGTH)
  @MaxLength(TrainingsMicroserviceConstant.TRAINING_NAME_MAX_LENGTH)
  name?: string;

  @Expose()
  @Type(() => String)
  @IsEnum(SkillLevelEnum)
  skillLevel?: SkillLevelType;

  @Expose()
  @Type(() => String)
  @IsEnum(TrainingTypeEnum)
  trainingType?: TrainingType;

  @Expose()
  @Type(() => String)
  @IsEnum(TimeForTrainingEnum)
  timeForTraining?: TimeForTrainingType;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Min(TrainingsMicroserviceConstant.TRAINING_PRICE_MIN_COUNT)
  price?: number;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Min(TrainingsMicroserviceConstant.TRAINING_CALORIES_MIN_COUNT)
  @Max(TrainingsMicroserviceConstant.TRAINING_CALORIES_MAX_COUNT)
  quantityOfCalories?: number;

  @Expose()
  @Type(() => String)
  @IsString()
  @MinLength(TrainingsMicroserviceConstant.TRAINING_DESCRIPTION_MIN_LENGTH)
  @MaxLength(TrainingsMicroserviceConstant.TRAINING_DESCRIPTION_MAX_LENGTH)
  description?: string;

  @Expose()
  @Type(() => String)
  @IsEnum(GenderEnum)
  gender?: GenderType;

  @Expose()
  @Type(() => String)
  @IsString()
  videoOfTraining?: string;

  @Expose()
  @Type(() => Boolean)
  @IsBoolean()
  specialOffer?: boolean;
}
