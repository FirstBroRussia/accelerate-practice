import { PaymentType, ProductType } from "@fitfriends-backend/shared-types";


export interface OrderInterface {
  purchaseType?: ProductType;

  productId?: string;

  productPrice?: number;

  quantity?: number;

  orderAmount?: number;

  paymentMethod?: PaymentType;

  createdAt?: Date;
}
