import { CreateOrderDto, DEFAULT_PAGINATION_LIMIT, GetOrdersQuery } from '@fitfriends-backend/shared-types';
import { Injectable, Logger } from '@nestjs/common';
import { OrderEntity } from './entity/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';

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

  public async getOrdersByIdAndRole(id: string, query: GetOrdersQuery): Promise<OrderEntity[] | any[]> {
    const { role, page, sort } = query;

    if (role === 'Student') {
      const options: QueryOptions<OrderEntity> = {
        skip: DEFAULT_PAGINATION_LIMIT * (page - 1),
        limit: DEFAULT_PAGINATION_LIMIT,
        sort: { createdAt: sort === 'desc' ? -1 : 1 },
      };

      return await this.orderModel.find({
        creatorUserId: id,
      }, null, options);
    } else {
      return await this.orderModel.aggregate([
        { $match: { coachUserId: id, } },
        { $sort: { createdAt: sort === 'desc' ? -1 : 1 } },
        { $skip: DEFAULT_PAGINATION_LIMIT * (page - 1) },
        { $limit: DEFAULT_PAGINATION_LIMIT },
        { $group: {
          _id: '$productId',
          quantity: { $sum: '$quantity' },
          totalAmount: { $sum: '$orderAmount' },
        } },
        { $project: {
          productId: '$_id',
          quantity: 1,
          totalAmount: 1,
          _id: 0,
        } }
      ]);
    }


  }


}
