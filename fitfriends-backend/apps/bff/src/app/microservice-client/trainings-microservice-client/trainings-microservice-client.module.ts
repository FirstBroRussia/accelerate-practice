import { Module } from '@nestjs/common';
import { TrainingsMicroserviceClientService } from './trainings-microservice-client.service';


@Module({
  providers: [TrainingsMicroserviceClientService],
  exports: [TrainingsMicroserviceClientService],
})
export class TrainingsMicroserviceClientModule {}
