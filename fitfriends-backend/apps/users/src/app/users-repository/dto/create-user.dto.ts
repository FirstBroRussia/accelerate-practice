import { BackgroundImageForUsercardEnum, BackgroundImageForUsercardType, GenderEnum, GenderType, LocationMetroEnum, LocationMetroType, UserInterface, UserRoleEnum, UserRoleType, UsersMicroserviceConstants } from "@fitfriends-backend/shared-types";

import { IsString, MinLength, MaxLength, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';


export class CreateUserDto implements UserInterface {
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

}
