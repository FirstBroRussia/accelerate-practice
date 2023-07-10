import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';

import { CoachOrderInfoRdo, CreateOrderDto, GetDocumentQuery, MongoIdValidationPipe, StudentOrderInfoRdo, TransformAndValidateDtoInterceptor } from '@fitfriends-backend/shared-types';
import { fillRDO } from '@fitfriends-backend/core';

import { OrdersService } from './orders.service';
import { BalanceOrdersFromOrdersMicroserviceDto } from '../../../../libs/shared-types/src/lib/dto/orders/balance-orders-from-orders-microservice.dto';


@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) { }


  @Post('/:creatorUserId/:targetTrainingCoachUserId')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(CreateOrderDto))
  public async createOrder(@Param('creatorUserId', MongoIdValidationPipe) creatorUserId: string, @Param('targetTrainingCoachUserId', MongoIdValidationPipe) targetTrainingCoachUserId: string, @Body() dto: CreateOrderDto): Promise<StudentOrderInfoRdo> {
    const result = await this.ordersService.createOrder(creatorUserId, targetTrainingCoachUserId, dto);

    return fillRDO(StudentOrderInfoRdo, result);
  }

  @Post('/:creatorUserId')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(GetDocumentQuery))
  public async getOrders(@Param('creatorUserId', MongoIdValidationPipe) creatorUserId: string, @Body() dto: GetDocumentQuery): Promise<StudentOrderInfoRdo[] | CoachOrderInfoRdo[]> {
    const { role } = dto;

    const result = await this.ordersService.getOrders(creatorUserId, dto);

    const rdo = role === 'Student' ? fillRDO(StudentOrderInfoRdo, result) : fillRDO(CoachOrderInfoRdo, result);


    return rdo as unknown as StudentOrderInfoRdo[] | CoachOrderInfoRdo[];
  }

  @Get('/id/:orderId/:creatorUserId')
  public async getOrderByIdAndCreatorUserId(@Param('orderId', MongoIdValidationPipe) orderId: string, @Param('creatorUserId', MongoIdValidationPipe) creatorUserId: string): Promise<StudentOrderInfoRdo> {
    const result = await this.ordersService.getOrderByIdAndCreatorUserId(orderId, creatorUserId);


    return fillRDO(StudentOrderInfoRdo, result);
  }

  @Get('balance/:studentUserId')
  public async getBalance(@Param('studentUserId', MongoIdValidationPipe) studentUserId: string): Promise<BalanceOrdersFromOrdersMicroserviceDto> {
    const result = await this.ordersService.getOrdersForBalanceStudentUser(studentUserId);


    return fillRDO(BalanceOrdersFromOrdersMicroserviceDto, result);
  }


}
