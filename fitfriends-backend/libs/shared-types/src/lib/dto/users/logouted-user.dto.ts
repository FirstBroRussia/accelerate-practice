import { Expose, Type } from "class-transformer";
import { IsInt, IsJWT } from "class-validator";

export class LogoutedUserDto {
  @Expose()
  @Type(() => String)
  @IsJWT()
  public refreshToken: string;

  @Expose()
  @IsInt()
  public exp: number;
}
