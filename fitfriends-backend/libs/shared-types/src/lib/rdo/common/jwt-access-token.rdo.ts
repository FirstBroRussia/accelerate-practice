import { Expose } from "class-transformer";

export class JwtAccessTokenRdo {
  @Expose()
  accessToken: string;
}
