import { Module } from '@nestjs/common';
import { TrainingsRepositoryService } from './trainings-repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { TrainingsMicroserviceEnvInterface } from '../../assets/interface/trainings-microservice-env.interface';
import { getMongoConnectionUrl } from '@fitfriends-backend/core';
import { CoachTrainingEntity, TrainingEntitySchema } from './entity/training.entity';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<TrainingsMicroserviceEnvInterface>) => ({
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
      { name: CoachTrainingEntity.name, schema: TrainingEntitySchema },
    ]),
  ],
  providers: [TrainingsRepositoryService],
  exports: [TrainingsRepositoryService],
})
export class TrainingsRepositoryModule {}
