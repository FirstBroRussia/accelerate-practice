import { Body, Controller, Get, Logger, Param, Post, UseInterceptors } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto, MongoIdValidationPipe, OrderRdo, TransformAndValidateDtoInterceptor } from '@fitfriends-backend/shared-types';
import { fillRDO } from '@fitfriends-backend/core';


@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(
    private readonly ordersService: OrdersService,
  ) { }


  @Post('/:creatorUserId/:targetTrainingCoachUserId')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(CreateOrderDto))
  public async createOrder(@Param('creatorUserId', MongoIdValidationPipe) creatorUserId: string, @Param('targetTrainingCoachUserId', MongoIdValidationPipe) targetTrainingCoachUserId: string, @Body() dto: CreateOrderDto): Promise<any> {
    const result = await this.ordersService.createOrder(creatorUserId, targetTrainingCoachUserId, dto);

    return fillRDO(OrderRdo, result);
  }


}
