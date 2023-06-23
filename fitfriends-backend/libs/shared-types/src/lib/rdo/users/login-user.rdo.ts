import { Expose } from "class-transformer";
import { IsJWT, IsString } from "class-validator";

export class LoginUserRdo {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

}
