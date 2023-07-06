/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { CommentModule } from './app/comment.module';
import { CommentsMicroserviceEnvInterface } from './assets/interface/comments-microservice-env.interface';

import { AllExceptionsFilter } from '@fitfriends-backend/shared-types';


async function bootstrap() {
  const app = await NestFactory.create(CommentModule);

  const config = app.get(ConfigService<CommentsMicroserviceEnvInterface>);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  const port = config.get('PORT') || 3000;
  const host = config.get('HOST') || '127.0.0.1';


  await app.listen(port, host);

  Logger.log(
    `🚀 Comments microservice is running on: http://localhost:${port}/`
  );
}

bootstrap();
