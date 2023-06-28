import { CreateOrderDto } from '@fitfriends-backend/shared-types';
import { Injectable, Logger } from '@nestjs/common';
import { OrderEntity } from './entity/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrdersRepositoryService {
  private readonly logger = new Logger(OrdersRepositoryService.name);

  constructor (
    @InjectModel(OrderEntity.name) private readonly orderModel: Model<OrderEntity>,
  ) { }


  public async create(creatorUserId: string, targetTrainingCoachUserId: string, dto: CreateOrderDto): Promise<OrderEntity> {
    const newOrderObj = new OrderEntity().fillObject(dto, creatorUserId, targetTrainingCoachUserId);

    return await this.orderModel.create(newOrderObj);
  }


}
