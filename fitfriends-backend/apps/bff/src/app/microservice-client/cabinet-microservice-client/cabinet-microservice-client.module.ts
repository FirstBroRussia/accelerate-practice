import { Module } from '@nestjs/common';
import { CabinetMicroserviceClientService } from './cabinet-microservice-client.service';

@Module({
  providers: [CabinetMicroserviceClientService],
})
export class CabinetMicroserviceClientModule {}
