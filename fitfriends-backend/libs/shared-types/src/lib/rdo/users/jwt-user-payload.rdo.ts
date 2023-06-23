import { Expose, Type } from "class-transformer"
import { IsEmail, IsEnum, IsInt, IsMongoId } from "class-validator";

import { UserRoleEnum, UserRoleType } from "@fitfriends-backend/shared-types";


export class JwtUserPayloadRdo {

  @Expose()
  @Type(() => String)
  @IsMongoId()
  public sub: string;

  @Expose()
  @Type(() => String)
  @IsEmail()
  public email: string;

  @Expose()
  @Type(() => String)
  @IsEnum(UserRoleEnum)
  public role: UserRoleType;

  @Expose()
  @Type(() => Number)
  @IsInt()
  exp?: number;

  @Expose()
  @Type(() => Number)
  @IsInt()
  iat?: number;

}
