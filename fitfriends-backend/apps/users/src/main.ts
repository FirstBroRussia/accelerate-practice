/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/users.module';
import { ConfigService } from '@nestjs/config';
import { UsersMicroserviceEnvInterface } from './assets/interface/users-microservice-env.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService<UsersMicroserviceEnvInterface>);

  const port = config.get('PORT') || 3000;
  const host = config.get('HOST') || '127.0.0.1';

  await app.listen(port, host);
  Logger.log(
    `🚀 Users microservice is running on: http://${host}:${port}`
  );
}

bootstrap();
