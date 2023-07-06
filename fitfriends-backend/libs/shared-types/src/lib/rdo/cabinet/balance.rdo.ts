import { Expose, Type } from "class-transformer";
import { CoachTrainingRdo } from "./coach-training.rdo";


export class BalanceRdo {
  @Expose()
  @Type(() => CoachTrainingRdo)
  productInfo: CoachTrainingRdo;

  @Expose()
  quantity: number;
}
