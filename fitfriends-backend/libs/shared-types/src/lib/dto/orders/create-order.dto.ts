import { Expose, Type } from "class-transformer";
import { IsEnum, IsInt, IsMongoId, IsNotEmpty, Max, Min } from "class-validator";

import { OrderInterface, OrdersMicroserviceConstant, PaymentEnum, PaymentType, ProductEnum, ProductType, ZERO_VALUE } from "@fitfriends-backend/shared-types";



export class CreateOrderDto implements OrderInterface {
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(ProductEnum)
  purchaseType: ProductType;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @Expose()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(ZERO_VALUE)
  productPrice: number;

  @Expose()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(OrdersMicroserviceConstant.QUANTITY_MIN_COUNT)
  @Max(OrdersMicroserviceConstant.QUANTITY_MAX_COUNT)
  quantity: number;

  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(ZERO_VALUE)
  orderAmount: number;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(PaymentEnum)
  paymentMethod: PaymentType;
}
