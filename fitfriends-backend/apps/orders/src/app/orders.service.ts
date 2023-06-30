import { Injectable, Logger } from '@nestjs/common';
import { OrdersRepositoryService } from './orders-repository/orders-repository.service';
import { CreateOrderDto, GetOrdersQuery } from '@fitfriends-backend/shared-types';
import { OrderEntity } from './orders-repository/entity/order.entity';


@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor (
    private readonly ordersRepository: OrdersRepositoryService,
  ) { }


  public async createOrder(creatorUserId: string, targetTrainingCoachUserId: string, dto: CreateOrderDto): Promise<OrderEntity> {
    const newOrder = await this.ordersRepository.create(creatorUserId, targetTrainingCoachUserId, dto);

    this.logger.log('Новый заказ создан.');


    return newOrder;
  }

  public async getOrders(id: string, query: GetOrdersQuery): Promise<OrderEntity[]> {
    return await this.ordersRepository.getOrdersByIdAndRole(id, query);
  }

}
