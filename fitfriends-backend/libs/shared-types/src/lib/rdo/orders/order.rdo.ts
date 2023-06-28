import { Expose, Transform } from "class-transformer";
import { OrderInterface } from "../../interface/orders/order.interface";
import { PaymentType } from "../../type/orders/payment.type";
import { ProductType } from "../../type/orders/product.type";


export class OrderRdo implements OrderInterface {
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
  purchaseType?: ProductType;

  @Expose()
  productId?: string;

  @Expose()
  productPrice?: number;

  @Expose()
  quantity?: number;

  @Expose()
  orderAmount?: number;

  @Expose()
  paymentMethod?: PaymentType;

  @Expose()
  createdAt?: Date;

  @Expose()
  creatorUserId: string;

  @Expose()
  coachUserId: string;
}
