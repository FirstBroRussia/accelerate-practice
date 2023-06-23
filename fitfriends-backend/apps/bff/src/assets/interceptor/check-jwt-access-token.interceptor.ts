import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtMicroserviceClientService } from '../../app/microservice-client/jwt-microservice-client/jwt-microservice-client.service';
import { HttpStatusCode } from 'axios';


@Injectable()
export class CheckJwtAccessTokenInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CheckJwtAccessTokenInterceptor.name);

  constructor (
    private readonly jwtMicroserviceClient: JwtMicroserviceClientService,
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    if (!request.headers.authorization) {
      return next.handle();
    }

    const accessToken = request.headers.authorization.split(' ')[1];

    await this.jwtMicroserviceClient.verifyAccessToken(accessToken);

    response
      .status(HttpStatusCode.Ok)
      .json({
        accessToken: accessToken,
    });

    return;
  }
}
