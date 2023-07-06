import { Module } from '@nestjs/common';
import { CommentsMicroserviceClientService } from './comments-microservice-client.service';


@Module({
  providers: [CommentsMicroserviceClientService],
  exports: [CommentsMicroserviceClientService],
})
export class CommentsMicroserviceClientModule {}
