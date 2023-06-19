import { Module } from '@nestjs/common';
import { UsersMicroserviceClientService } from './users-microservice-client.service';


@Module({
  imports: [],
  providers: [UsersMicroserviceClientService],
  exports: [UsersMicroserviceClientService],
})
export class UsersMicroserviceClientModule { }
