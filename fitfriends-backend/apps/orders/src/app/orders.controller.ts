import { Body, Controller, Get, Logger, Param, Post, Query, UseInterceptors } from '@nestjs/common';

import { CoachOrderInfoRdo, CreateOrderDto, GetOrdersQuery, MongoIdValidationPipe, StudentOrderInfoRdo, TransformAndValidateDtoInterceptor, UserRoleType, UserRoleValidationPipe } from '@fitfriends-backend/shared-types';
import { fillRDO } from '@fitfriends-backend/core';

import { OrdersService } from './orders.service';


@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

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
  @UseInterceptors(new TransformAndValidateDtoInterceptor(GetOrdersQuery))
  public async getOrders(@Param('creatorUserId', MongoIdValidationPipe) creatorUserId: string, @Body() dto: GetOrdersQuery): Promise<StudentOrderInfoRdo[] | CoachOrderInfoRdo[]> {
    const { role } = dto;

    const result = await this.ordersService.getOrders(creatorUserId, dto);

    const rdo = role === 'Student' ? fillRDO(StudentOrderInfoRdo, result) : fillRDO(CoachOrderInfoRdo, result);


    return rdo as unknown as StudentOrderInfoRdo[] | CoachOrderInfoRdo[];
  }


}
