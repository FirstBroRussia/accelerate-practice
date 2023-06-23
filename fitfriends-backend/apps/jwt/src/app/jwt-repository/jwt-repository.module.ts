import { Module } from '@nestjs/common';
import { JwtRepositoryService } from './jwt-repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { getMongoConnectionUrl } from '@fitfriends-backend/core';
import { JwtMicroserviceEnvInterface } from '../../assets/interface/jwt-microservice-env.interface';
import { LogoutedUserEntity, LogoutedUserEntitySchema } from './entity/logouted-user.entity';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<JwtMicroserviceEnvInterface>) => ({
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
      { name: LogoutedUserEntity.name, schema: LogoutedUserEntitySchema },
    ]),
  ],
  providers: [JwtRepositoryService],
  exports: [JwtRepositoryService],
})
export class JwtRepositoryModule {}
