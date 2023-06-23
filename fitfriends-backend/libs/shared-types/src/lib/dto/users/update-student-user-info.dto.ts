import {
  BackgroundImageForUsercardEnum,
  BackgroundImageForUsercardType,
  GenderEnum,
  GenderType,
  IsTrainingTypeArrayValidator,
  LocationMetroEnum,
  LocationMetroType,
  SkillLevelEnum,
  SkillLevelType,
  TimeForTrainingEnum,
  TimeForTrainingType,
  TrainingType,
  UserInterface,
  UsersMicroserviceConstants,
} from "@fitfriends-backend/shared-types";

import { IsString, MinLength, MaxLength, IsNotEmpty, IsEnum, IsArray, ArrayMinSize, ArrayMaxSize, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';


export class UpdateStudentUserInfoDto implements UserInterface {
  @Expose()
  @Type(() => String)
  @IsString()
  @MinLength(UsersMicroserviceConstants.USERNAME_MIN_LENGTH)
  @MaxLength(UsersMicroserviceConstants.USERNAME_MAX_LENGTH)
  public name?: string;

  @Expose()
  @Type(() => String)
  @IsString()
  public avatar?: string;

  @Expose()
  @Type(() => String)
  @IsEnum(GenderEnum)
  public gender?: GenderType;

  @Expose()
  @Transform(({ value }) => new Date(value).toISOString())
  @Type(() => String)
  @IsString()
  public dateOfBirth?: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @MinLength(UsersMicroserviceConstants.DESCRIPTION_MIN_LENGTH)
  @MaxLength(UsersMicroserviceConstants.DESCRIPTION_MAX_LENGTH)
  public description?: string;

  @IsNotEmpty()
  @Type(() => String)
  @IsEnum(LocationMetroEnum)
  public location?: LocationMetroType;

  @Expose()
  @Type(() => String)
  @IsEnum(BackgroundImageForUsercardEnum)
  public imageForSite?: BackgroundImageForUsercardType;

  @Expose()
  @Type(() => String)
  @IsEnum(SkillLevelEnum)
  public skillLevel?: SkillLevelType;

  @Expose()
  @Transform(({value}) => {
    try {
      return JSON.parse(value)
    } catch {
      return value;
    }
  })
  @Type(() => Array)
  @IsArray()
  @ArrayMinSize(UsersMicroserviceConstants.TRAINING_TYPE_MIN_COUNT)
  @ArrayMaxSize(UsersMicroserviceConstants.TRAINING_TYPE_MAX_COUNT)
  @IsTrainingTypeArrayValidator({ message: 'Значение в массиве не соответствует дефолтным!' })
  public trainingType?: TrainingType[];

  @Expose()
  @Type(() => String)
  @IsEnum(TimeForTrainingEnum)
  public timeForTraining?: TimeForTrainingType;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Min(UsersMicroserviceConstants.CALORIES_RESET_ALL_DAYS_MIN_VALUE)
  @Max(UsersMicroserviceConstants.CALORIES_RESET_ALL_DAYS_MAX_VALUE)
  public allCaloriesToReset?: number;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Min(UsersMicroserviceConstants.CALORIES_RESET_IN_DAY_MIN_VALUE)
  @Max(UsersMicroserviceConstants.CALORIES_RESET_IN_DAY_MAX_VALUE)
  public caloriesToResetInDay?: number;

  @Expose()
  @Type(() => Boolean)
  @IsBoolean()
  public trainingIsReady: boolean;

}
