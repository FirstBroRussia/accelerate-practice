import { Module } from '@nestjs/common';
import { OrdersMicroserviceClientService } from './orders-microservice-client.service';

@Module({
  providers: [OrdersMicroserviceClientService],
  exports: [OrdersMicroserviceClientService],
})
export class OrdersMicroserviceClientModule {}
