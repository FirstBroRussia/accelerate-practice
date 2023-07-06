import { resolve } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ordersEnvValidateConfig } from '../assets/validate/orders-env-config.validate';
import { OrdersRepositoryModule } from './orders-repository/orders-repository.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [resolve('./', 'apps', 'orders', 'env', 'development.env')],
      validate: ordersEnvValidateConfig,
    }),
    OrdersRepositoryModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
