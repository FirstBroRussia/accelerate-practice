import { Controller, Logger, Post } from '@nestjs/common';



import { ConfigService } from '@nestjs/config';
import { BffMicroserviceEnvInterface } from '../assets/interface/bff-microservice-env.interface';
import { CommentsMicroserviceClientService } from './microservice-client/comments-microservice-client/comments-microservice-client.service';
import { NotifyMicroserviceClientService } from './microservice-client/notify-microservice-client/notify-microservice-client.service';
import { OrdersMicroserviceClientService } from './microservice-client/orders-microservice-client/orders-microservice-client.service';
import { TrainingsMicroserviceClientService } from './microservice-client/trainings-microservice-client/trainings-microservice-client.service';
import { UsersMicroserviceClientService } from './microservice-client/users-microservice-client/users-microservice-client.service';
import { BffService } from './bff.service';


@Controller()
export class BffController {
  private readonly logger = new Logger(BffController.name);

  constructor(
    private readonly bffService: BffService,
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
    private readonly usersMicroserviceClient: UsersMicroserviceClientService,
    private readonly trainingsMicroserviceClient: TrainingsMicroserviceClientService,
    private readonly ordersMicroserviceClient: OrdersMicroserviceClientService,
    private readonly commentsMicroserviceClient: CommentsMicroserviceClientService,
    private readonly notifyMicroserviceClient: NotifyMicroserviceClientService,
  ) { }


  @Post('mockdata/create')
  public async createMockData(): Promise<any> {

  }

}
