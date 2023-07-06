import { Expose } from "class-transformer";
import { IsNotEmpty, IsMongoId } from "class-validator";


export class RemoveNotifyDto {
  @Expose()
  @IsNotEmpty()
  @IsMongoId()
  notifyId: string;

  @Expose()
  @IsNotEmpty()
  @IsMongoId()
  targetUserId: string;
}
