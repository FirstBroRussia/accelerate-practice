import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { OrdersRepositoryService } from './orders-repository/orders-repository.service';
import { CreateOrderDto, GetDocumentQuery } from '@fitfriends-backend/shared-types';
import { OrderEntity } from './orders-repository/entity/order.entity';
import { BalanceOrdersFromOrdersMicroserviceDto } from '../../../../libs/shared-types/src/lib/dto/orders/balance-orders-from-orders-microservice.dto';


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

  public async getOrders(creatorUserId: string, query: GetDocumentQuery): Promise<OrderEntity[]> {
    return await this.ordersRepository.getOrdersByUserIdAndRole(creatorUserId, query);
  }

  public async getOrderById(id: string): Promise<OrderEntity> {
    const result = await this.ordersRepository.getOrderById(id);

    if (!result) {
      throw new BadRequestException(`Ордера с ID: ${id} не существует.`);
    }


    return result;
  }

  public async getOrderByIdAndCreatorUserId(orderId: string, creatorUserId): Promise<OrderEntity> {
    const result = await this.ordersRepository.getOrderByIdAndCreatorUserId(orderId, creatorUserId);

    if (!result) {
      throw new BadRequestException(`Данного ордера для данного пользователя не существует.`);
    }


    return result;
  }

  public async getOrdersForBalanceStudentUser(studentUserId: string): Promise<BalanceOrdersFromOrdersMicroserviceDto> {
    return await this.ordersRepository.getOrdersForBalanceStudentUser(studentUserId);
  }

}
