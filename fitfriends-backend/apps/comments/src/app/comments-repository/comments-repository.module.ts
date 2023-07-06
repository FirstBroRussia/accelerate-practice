import { Module } from '@nestjs/common';
import { CommentsRepositoryService } from './comments-repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { CommentsMicroserviceEnvInterface } from '../../assets/interface/comments-microservice-env.interface';
import { getMongoConnectionUrl } from '@fitfriends-backend/core';
import { CommentEntity, CommentEntitySchema } from './entity/comment.entity';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<CommentsMicroserviceEnvInterface>) => ({
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
      { name: CommentEntity.name, schema: CommentEntitySchema },
    ]),
  ],
  providers: [CommentsRepositoryService],
  exports: [CommentsRepositoryService],
})
export class CommentsRepositoryModule {}
