import { Module } from '@nestjs/common';
import { UsersRepositoryService } from './users-repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { UsersMicroserviceEnvInterface } from '../../assets/interface/users-microservice-env.interface';

import { getMongoConnectionUrl } from '@fitfriends-backend/core';
import { UserEntity, UserEntitySchema } from './entity/user.entity';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<UsersMicroserviceEnvInterface>) => ({
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
      { name: UserEntity.name, schema: UserEntitySchema, },
    ]),
  ],
  providers: [
    UsersRepositoryService,
  ],
})
export class UsersRepositoryModule {}