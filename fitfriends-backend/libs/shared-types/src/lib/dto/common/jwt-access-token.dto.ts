import { Expose } from "class-transformer";
import { IsJWT } from "class-validator";

export class JwtAccessTokenDto {
  @Expose()
  @IsJWT()
  accessToken: string;

}
