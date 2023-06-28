import { Injectable, Logger } from '@nestjs/common';
import { OrdersRepositoryService } from './orders-repository/orders-repository.service';
import { CreateOrderDto } from '@fitfriends-backend/shared-types';
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

}
