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
  UserRoleEnum,
  UserRoleType,
  UsersMicroserviceConstants,
} from "@fitfriends-backend/shared-types";


import { IsString, MinLength, MaxLength, IsEmail, IsNotEmpty, IsEnum, IsArray, ArrayMinSize, ArrayMaxSize, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';


export class StudentCreateUserDto implements UserInterface {
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(UsersMicroserviceConstants.USERNAME_MIN_LENGTH)
  @MaxLength(UsersMicroserviceConstants.USERNAME_MAX_LENGTH)
  public name: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(UsersMicroserviceConstants.PASSWORD_MIN_LENGTH)
  @MaxLength(UsersMicroserviceConstants.PASSWORD_MAX_LENGTH)
  public password: string;

  @Expose()
  @Type(() => String)
  @IsString()
  public avatar: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  public gender: GenderType;

  @Expose()
  @Type(() => String)
  @IsString()
  dateOfBirth: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  public role: UserRoleType;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(UsersMicroserviceConstants.DESCRIPTION_MIN_LENGTH)
  @MaxLength(UsersMicroserviceConstants.DESCRIPTION_MAX_LENGTH)
  public description: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(LocationMetroEnum)
  public location: LocationMetroType;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(BackgroundImageForUsercardEnum)
  public imageForSite: BackgroundImageForUsercardType;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(SkillLevelEnum)
  public skillLevel: SkillLevelType;

  @Expose()
  @Transform(({value}) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(UsersMicroserviceConstants.TRAINING_TYPE_MIN_COUNT)
  @ArrayMaxSize(UsersMicroserviceConstants.TRAINING_TYPE_MAX_COUNT)
  @IsTrainingTypeArrayValidator({ message: 'Значение в массиве не соответствует дефолтным!' })
  public trainingType: TrainingType[];

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(TimeForTrainingEnum)
  public timeForTraining: TimeForTrainingType;

  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(UsersMicroserviceConstants.CALORIES_RESET_ALL_DAYS_MIN_VALUE)
  @Max(UsersMicroserviceConstants.CALORIES_RESET_ALL_DAYS_MAX_VALUE)
  public allCaloriesToReset: number;

  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(UsersMicroserviceConstants.CALORIES_RESET_IN_DAY_MIN_VALUE)
  @Max(UsersMicroserviceConstants.CALORIES_RESET_IN_DAY_MAX_VALUE)
  public caloriesToResetInDay: number;

  @Expose()
  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  public trainingIsReady: boolean;
}
