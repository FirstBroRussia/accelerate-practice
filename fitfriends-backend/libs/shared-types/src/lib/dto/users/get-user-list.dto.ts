import { Expose, Type } from "class-transformer";


export class GetUserListDto {
  @Expose()
  @Type(() => String)
  userIds: string[];
}
