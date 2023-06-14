import { BackgroundImageForUsercardEnum, BackgroundImageForUsercardType, GenderEnum, GenderType, LocationMetroEnum, LocationMetroType, UserInterface, UserRoleEnum, UserRoleType } from "@fitfriends-backend-nx-monorepo/shared-types";

import { IsString, MinLength, MaxLength, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';


export const UsersMicroserviceConstants = {

};

const USERNAME_MIN_LENGTH = 1;
const USERNAME_MAX_LENGTH = 15;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 12;
const DESCRIPTION_MIN_LENGTH = 10;
const DESCRIPTION_MAX_LENGTH = 140;


export class CreateUserDto implements UserInterface {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(USERNAME_MIN_LENGTH)
  @MaxLength(USERNAME_MAX_LENGTH)
  public name: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
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
  @MinLength(DESCRIPTION_MIN_LENGTH)
  @MaxLength(DESCRIPTION_MAX_LENGTH)
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
