import { Request } from 'express';

import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BffMicroserviceEnvInterface } from '../interface/bff-microservice-env.interface';
import { JwtMicroserviceClientService } from '../../app/microservice-client/jwt-microservice-client/jwt-microservice-client.service';
import { JwtUserPayloadRdo } from '@fitfriends-backend/shared-types';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor (
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
    private readonly jwtMicroserviceClient: JwtMicroserviceClientService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: JwtUserPayloadRdo }>();

    const accessToken = request.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException('Передайте аутентификационный токен, или авторизуйтесь.');
    }

    const jwtUserPayload = await this.jwtMicroserviceClient.verifyAccessToken(accessToken);

    request.user = jwtUserPayload;


    return true;
  }

}
