import { Module } from '@nestjs/common';
import { JwtMicroserviceClientService } from './jwt-microservice-client.service';

@Module({
  providers: [JwtMicroserviceClientService],
  exports: [JwtMicroserviceClientService],
})
export class JwtMicroserviceClientModule {}
