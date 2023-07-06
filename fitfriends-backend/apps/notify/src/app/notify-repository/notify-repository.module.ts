import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotifyRepositoryService } from './notify-repository.service';
import { ConfigService } from '@nestjs/config';
import { NotifyMicroserviceEnvInterface } from '../../assets/interface/notify-microservice-env.interface';
import { getMongoConnectionUrl } from '@fitfriends-backend/core';
import { NotifyEntity, NotifyEntitySchema } from './entity/notify.entity';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<NotifyMicroserviceEnvInterface>) => ({
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
      { name: NotifyEntity.name, schema: NotifyEntitySchema },
    ]),
  ],
  providers: [NotifyRepositoryService],
  exports: [NotifyRepositoryService],
})
export class NotifyRepositoryModule {}
