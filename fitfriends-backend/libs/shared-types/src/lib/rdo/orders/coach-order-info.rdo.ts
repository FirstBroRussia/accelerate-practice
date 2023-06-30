import { Expose } from "class-transformer";
import { CoachTrainingRdo } from "../cabinet/coach-training.rdo";

export class CoachOrderInfoRdo {
  @Expose()
  productId: string;

  @Expose()
  quantity: number;

  @Expose()
  totalAmount: number;

  @Expose()
  product?: CoachTrainingRdo;
}
