import { CreateOrderDto, DEFAULT_PAGINATION_LIMIT, GetDocumentQuery } from '@fitfriends-backend/shared-types';
import { Injectable, Logger } from '@nestjs/common';
import { OrderEntity } from './entity/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { BalanceOrdersFromOrdersMicroserviceDto } from '../../../../../libs/shared-types/src/lib/dto/orders/balance-orders-from-orders-microservice.dto';

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

  public async getOrderById(id: string): Promise<OrderEntity | null> {
    return await this.orderModel.findById(id);
  }

  public async getOrderByIdAndCreatorUserId(id: string, creatorUserId: string): Promise<OrderEntity | null> {
    return await this.orderModel.findOne({
      _id: id,
      creatorUserId: creatorUserId,
    });
  }

  public async getOrdersByUserIdAndRole(id: string, query: GetDocumentQuery): Promise<OrderEntity[] | any[]> {
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
        } },
        { $sort: { createdAt: sort === 'desc' ? -1 : 1 } },
        { $skip: DEFAULT_PAGINATION_LIMIT * (page - 1) },
        { $limit: DEFAULT_PAGINATION_LIMIT }
      ]);
    }

  }

  public async getOrdersForBalanceStudentUser(studentUserId: string): Promise<BalanceOrdersFromOrdersMicroserviceDto> {
    const result = await this.orderModel.aggregate([
      { $match: { creatorUserId: studentUserId } },
      { $group: {
        _id: '$productId',
        quantity: { $sum: '$quantity' }
      } },
      { $group: {
        _id: null,
        productIds: { $push: '$_id' },
        products: { $push: { productId: '$_id', quantity: '$quantity' } }
      } },
      { $project: {
        productIds: 1,
        products: 1,
        _id: 0
      } },
    ]);

    return result[0];
  }


}
