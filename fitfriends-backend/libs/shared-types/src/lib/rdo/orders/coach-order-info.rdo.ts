import { Expose, Transform } from "class-transformer";
import { CoachTrainingRdo } from "../cabinet/coach-training.rdo";

export class CoachOrderInfoRdo {
  @Expose()
  @Transform(({ value, obj }) => {
    try {
      return obj._id.toString();
    } catch {
      return value;
    }
  })
  id: string;

  @Expose()
  productId: string;

  @Expose()
  quantity: number;

  @Expose()
  totalAmount: number;

  @Expose()
  product?: CoachTrainingRdo;
}
