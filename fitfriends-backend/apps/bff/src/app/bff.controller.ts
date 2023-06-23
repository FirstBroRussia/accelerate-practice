import { Controller, Logger } from '@nestjs/common';



import { ConfigService } from '@nestjs/config';
import { BffMicroserviceEnvInterface } from '../assets/interface/bff-microservice-env.interface';


@Controller()
export class BffController {
  private readonly logger = new Logger(BffController.name);

  constructor(
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
  ) { }

}
