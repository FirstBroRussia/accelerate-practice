/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { NotifyModule } from './app/notify.module';
import { NotifyMicroserviceEnvInterface } from './assets/interface/notify-microservice-env.interface';
import { ConfigService } from '@nestjs/config';

import { AllExceptionsFilter } from '@fitfriends-backend/shared-types';
import { Transport } from '@nestjs/microservices';


async function bootstrap() {
  const app = await NestFactory.create(NotifyModule);

  const config = app.get(ConfigService<NotifyMicroserviceEnvInterface>);
  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const microserviceOptions = (() => {
    const user = config.get<string>('RABBIT_USER');
    const password = config.get<string>('RABBIT_PASSWORD');
    const host = config.get<string>('RABBIT_HOST');
    const port = config.get<number>('RABBIT_PORT');
    const queue = config.get<string>('RABBIT_QUEUE');
    const url = `amqp://${user}:${password}@${host}:${port}`;

    return {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: queue,
        persistent: true,
        noAck: true,
        queueOptions: {
          durable: true,
        },
      },
    };
  })();
  app.connectMicroservice(microserviceOptions);


  const port = config.get('PORT') || 3000;
  const host = config.get('HOST') || '127.0.0.1';


  await Promise.all([app.startAllMicroservices(), app.listen(port, host)]);

  Logger.log(
    `🚀 Notify microservice is running on: http://localhost:${port}/`
  );
}

bootstrap();
