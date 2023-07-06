import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { NotifyMicroserviceClientService } from './notify-microservice-client.service';
import { BffMicroserviceEnvInterface } from 'apps/bff/src/assets/interface/bff-microservice-env.interface';
import { BffMicroserviceConstant } from '@fitfriends-backend/shared-types';


@Module({
  imports: [
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: BffMicroserviceConstant.NOTIFY_MICROSERVICE_CLIENT,
          inject: [ConfigService],
          useFactory: (config: ConfigService<BffMicroserviceEnvInterface>) => ({
            transport: Transport.RMQ,
            options: {
              urls: [
                `amqp://${config.get('RABBIT_USER')}:${config.get(
                  'RABBIT_PASSWORD'
                )}@${config.get('RABBIT_HOST')}:${config.get('RABBIT_PORT')}`,
              ],
              queue: config.get('RABBIT_QUEUE'),
              persistent: true,
              noAck: true,
              queueOptions: {
                durable: true,
              },
            },
          }),
        },
      ],
    }),
  ],
  providers: [NotifyMicroserviceClientService],
  exports: [NotifyMicroserviceClientService],
})
export class NotifyMicroserviceClientModule {}
