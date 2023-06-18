import { BackgroundImageForUsercardEnum, BackgroundImageForUsercardType, GenderEnum, GenderType, IsTrainingTypeArrayValidator, LocationMetroEnum, LocationMetroType, SkillLevelEnum, SkillLevelType, TimeForTrainingEnum, TimeForTrainingType, TrainingType, TrainingTypeEnum, UserInterface, UserRoleEnum, UserRoleType, UsersMicroserviceConstants } from "@fitfriends-backend/shared-types";

import { IsString, MinLength, MaxLength, IsEmail, IsNotEmpty, IsEnum, IsArray, ArrayMinSize, ArrayMaxSize, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Expose } from 'class-transformer';


export class BaseCreateUserDto implements UserInterface {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(UsersMicroserviceConstants.USERNAME_MIN_LENGTH)
  @MaxLength(UsersMicroserviceConstants.USERNAME_MAX_LENGTH)
  public name: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(UsersMicroserviceConstants.PASSWORD_MIN_LENGTH)
  @MaxLength(UsersMicroserviceConstants.PASSWORD_MAX_LENGTH)
  public password: string;

  @Expose()
  @IsString()
  public avatar: string;

  @Expose()
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  public gender: GenderType;

  @Expose()
  @IsString()
  dateOfBirth: string;

  @Expose()
  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  public role: UserRoleType;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(UsersMicroserviceConstants.DESCRIPTION_MIN_LENGTH)
  @MaxLength(UsersMicroserviceConstants.DESCRIPTION_MAX_LENGTH)
  public description: string;

  @Expose()
  @IsNotEmpty()
  @IsEnum(LocationMetroEnum)
  public location: LocationMetroType;

  @Expose()
  @IsNotEmpty()
  @IsEnum(BackgroundImageForUsercardEnum)
  public imageForSite: BackgroundImageForUsercardType;

  @Expose()
  @IsNotEmpty()
  @IsEnum(SkillLevelEnum)
  public skillLevel: SkillLevelType;

  @Expose()
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(UsersMicroserviceConstants.TRAINING_TYPE_MIN_COUNT)
  @ArrayMaxSize(UsersMicroserviceConstants.TRAINING_TYPE_MAX_COUNT)
  @IsTrainingTypeArrayValidator({ message: 'Значение в массиве не соответствует дефолтным!' })
  public trainingType: TrainingType[];

}

export class StudentCreateUserDto extends BaseCreateUserDto {
  @Expose()
  @IsNotEmpty()
  @IsEnum(TimeForTrainingEnum)
  public timeForTraining: TimeForTrainingType;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(UsersMicroserviceConstants.CALORIES_RESET_ALL_DAYS_MIN_VALUE)
  @Max(UsersMicroserviceConstants.CALORIES_RESET_ALL_DAYS_MAX_VALUE)
  public allCaloriesToReset: number;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(UsersMicroserviceConstants.CALORIES_RESET_IN_DAY_MIN_VALUE)
  @Max(UsersMicroserviceConstants.CALORIES_RESET_IN_DAY_MAX_VALUE)
  public caloriesToResetInDay: number;

  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  public trainingIsReady: boolean;
}

export class CoachCreateUserDto extends BaseCreateUserDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  certificates: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(UsersMicroserviceConstants.AWARDS_COACH_STRING_MIN_LENGTH)
  @MaxLength(UsersMicroserviceConstants.AWARDS_COACH_STRING_MAX_LENGTH)
  awardsToCoach: string;

  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  personalTraining: boolean;
}
