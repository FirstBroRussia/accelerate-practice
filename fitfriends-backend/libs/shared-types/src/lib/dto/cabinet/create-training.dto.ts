import { Expose, Type } from "class-transformer";
import { TrainingInterface } from "../../interface/cabinet/training.interface";
import { GenderType } from "../../type/users/gender.type";
import { SkillLevelType } from "../../type/users/skill-level.type";
import { TimeForTrainingType } from "../../type/users/time-for-training.type";
import { TrainingType } from "../../type/users/training-type.type";
import { IsBoolean, IsEnum, IsIn, IsInt, IsMongoId, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { TrainingsMicroserviceConstant } from "../../constant/trainings-microservice.constant";
import { SkillLevelEnum } from "../../enum/users/skill-level.enum";
import { TrainingTypeEnum } from "../../enum/users/training-type.enum";
import { TimeForTrainingEnum } from "../../enum/users/time-for-training.enum";
import { GenderEnum } from "../../enum/users/gender.enum";


export class CreateTrainingDto implements TrainingInterface {
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(TrainingsMicroserviceConstant.TRAINING_NAME_MIN_LENGTH)
  @MaxLength(TrainingsMicroserviceConstant.TRAINING_NAME_MAX_LENGTH)
  name?: string;

  // backgroundImage?: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(SkillLevelEnum)
  skillLevel?: SkillLevelType;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(TrainingTypeEnum)
  trainingType?: TrainingType;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(TimeForTrainingEnum)
  timeForTraining?: TimeForTrainingType;

  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(TrainingsMicroserviceConstant.TRAINING_PRICE_MIN_COUNT)
  price?: number;

  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(TrainingsMicroserviceConstant.TRAINING_CALORIES_MIN_COUNT)
  @Max(TrainingsMicroserviceConstant.TRAINING_CALORIES_MAX_COUNT)
  quantityOfCalories?: number;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(TrainingsMicroserviceConstant.TRAINING_DESCRIPTION_MIN_LENGTH)
  @MaxLength(TrainingsMicroserviceConstant.TRAINING_DESCRIPTION_MAX_LENGTH)
  description?: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender?: GenderType;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  videoOfTraining?: string;

  @Expose()
  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  specialOffer?: boolean;

  coachCreator?: string;

}
