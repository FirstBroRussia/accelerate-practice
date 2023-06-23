import { Expose, Type } from "class-transformer"
import { IsEmail, IsEnum, IsInt, IsMongoId } from "class-validator";
import { UserRoleEnum } from "../../enum/users/user-role.enum";
import { JWTPayload } from "jose";

export class JwtUserPayloadDto implements JWTPayload {
  [propName: string]: unknown;

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
  public role: string;

}
