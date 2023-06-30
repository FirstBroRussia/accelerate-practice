import { CreateOrderDto, OrderInterface, PaymentType, ProductType } from "@fitfriends-backend/shared-types";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export interface OrderEntity extends Document { }


@Schema({
  collection: 'orders',
  timestamps: true,
})
export class OrderEntity implements OrderInterface {
  @Prop({
    required: true,
    trim: true,
    type: String,
  })
  purchaseType?: ProductType;

  @Prop({
    required: true,
    trim: true,
    type: String,
    index: true,
  })
  productId?: string;

  @Prop({
    required: true,
    trim: true,
    type: Number,
  })
  productPrice?: number;

  @Prop({
    required: true,
    trim: true,
    type: Number,
  })
  quantity?: number;

  @Prop({
    required: true,
    trim: true,
    type: Number,
  })
  orderAmount?: number;

  @Prop({
    required: true,
    trim: true,
    type: String,
  })
  paymentMethod?: PaymentType;

  @Prop({
    required: true,
    trim: true,
    type: String,
    index: true,
  })
  creatorUserId: string;

  @Prop({
    required: true,
    trim: true,
    type: String,
    index: true,
  })
  coachUserId: string;


  public fillObject(dto: CreateOrderDto, creatorUserId: string, coachUserId: string): this {
    const { purchaseType, productId, productPrice, quantity, orderAmount, paymentMethod } = dto;

    this.purchaseType = purchaseType;
    this.productId = productId;
    this.productPrice = productPrice;
    this.quantity = quantity;
    this.orderAmount = orderAmount;
    this.paymentMethod = paymentMethod;

    this.creatorUserId = creatorUserId;
    this.coachUserId = coachUserId;


    return this;
  }

}

export const OrderEntitySchema = SchemaFactory.createForClass(OrderEntity);
