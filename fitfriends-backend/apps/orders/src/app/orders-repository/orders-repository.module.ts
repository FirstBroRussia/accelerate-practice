import { Module } from '@nestjs/common';
import { OrdersRepositoryService } from './orders-repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConnectionUrl } from '@fitfriends-backend/core';
import { ConfigService } from '@nestjs/config';
import { OrdersMicroserviceEnvInterface } from '../../assets/interface/orders-microservice-env.interface';
import { OrderEntity, OrderEntitySchema } from './entity/order.entity';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<OrdersMicroserviceEnvInterface>) => ({
        uri: getMongoConnectionUrl({
          host: config.get('MONGO_DB_HOST'),
          port: config.get('MONGO_DB_PORT'),
          username: config.get('MONGO_DB_USERNAME'),
          password: config.get('MONGO_DB_PASSWORD'),
          databaseName: config.get('MONGO_DB_NAME'),
          authDatabase: config.get('MONGO_AUTH_BASE'),
        }),
      }),
    }),
    MongooseModule.forFeature([
      { name: OrderEntity.name, schema: OrderEntitySchema },
    ]),
  ],
  providers: [OrdersRepositoryService],
  exports: [OrdersRepositoryService],
})
export class OrdersRepositoryModule {}
