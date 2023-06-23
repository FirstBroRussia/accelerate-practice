import { Expose } from "class-transformer";
import { IsJWT } from "class-validator";

export class JwtRefreshTokenDto {
  @Expose()
  @IsJWT()
  refreshToken: string;

}
