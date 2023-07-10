import { Expose } from "class-transformer";

export class LoginUserRdo {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

}
