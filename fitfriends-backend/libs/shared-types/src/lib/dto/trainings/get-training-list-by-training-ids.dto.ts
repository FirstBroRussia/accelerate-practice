import { IsMongoIdArrayValidator } from "@fitfriends-backend/shared-types";
import { Expose } from "class-transformer";
import { IsArray } from "class-validator";


export class GetTrainingListByTrainingIdsDto {
  @Expose()
  @IsArray()
  @IsMongoIdArrayValidator({ message: 'Элементы в массиве не являются MongoID' })
  ids: string[];
}
