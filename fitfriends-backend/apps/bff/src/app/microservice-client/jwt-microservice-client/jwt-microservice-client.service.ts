import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BffMicroserviceEnvInterface } from '../../../assets/interface/bff-microservice-env.interface';
import { CustomErrorResponseType, JwtAccessTokenDto, JwtAccessTokenRdo, JwtRefreshTokenDto, JwtUserPayloadDto, JwtUserPayloadRdo, LoginUserRdo } from '@fitfriends-backend/shared-types';
import axios, { AxiosError } from 'axios';


@Injectable()
export class JwtMicroserviceClientService {
  private readonly logger = new Logger(JwtMicroserviceClientService.name);

  constructor (
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
  ) { }


  public async generateTokens(dto: JwtUserPayloadDto): Promise<LoginUserRdo> {
    const { data } = await axios.post(`${this.config.get('JWT_MICROSERVICE_URL')}/jwt/generatetokens`, dto, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((err: AxiosError) => {
      const { name, stack, response } = err;

      const { message, statusCode, error } = response.data as CustomErrorResponseType;

      throw new BadRequestException({
        name: name,
        message: message,
        code: statusCode,
        status: error,
        stack: stack,
      });
    });


    return data;
  }

  public async verifyAccessToken(accessToken: string): Promise<JwtUserPayloadRdo> {
    const dto: JwtAccessTokenDto = {
      accessToken: accessToken,
    };

    const { data } = await axios.post(`${this.config.get('JWT_MICROSERVICE_URL')}/jwt/verifyaccesstoken`, dto, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((err: AxiosError) => {
      const { name, stack, response } = err;

      const { message, statusCode, error } = response.data as CustomErrorResponseType;

      throw new BadRequestException({
        name: name,
        message: message,
        code: statusCode,
        status: error,
        stack: stack,
      });
    });


    return data;
  }

  public async updateAccessToken(refreshToken: string): Promise<JwtAccessTokenRdo> {
    const dto: JwtRefreshTokenDto = {
      refreshToken: refreshToken,
    };

    const { data } = await axios.post(`${this.config.get('JWT_MICROSERVICE_URL')}/jwt/updateaccesstoken`, dto, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((err: AxiosError) => {
      const { name, stack, response } = err;

      const { message, statusCode, error } = response.data as CustomErrorResponseType;

      throw new BadRequestException({
        name: name,
        message: message,
        code: statusCode,
        status: error,
        stack: stack,
      });
    });


    return data;
  }

  public async logout(dto: JwtRefreshTokenDto): Promise<void> {
    const { data } = await axios.post(`${this.config.get('JWT_MICROSERVICE_URL')}/jwt/revokelogoutedrefreshtoken`, dto, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((err: AxiosError) => {
      const { name, stack, response } = err;

      const { message, statusCode, error } = response.data as CustomErrorResponseType;

      throw new BadRequestException({
        name: name,
        message: message,
        code: statusCode,
        status: error,
        stack: stack,
      });
    });


    return data;
  }

  public async checkLogoutedRefreshToken(dto: JwtRefreshTokenDto): Promise<void> {
    const { data } = await axios.post(`${this.config.get('JWT_MICROSERVICE_URL')}/jwt/checklogoutedrefreshtoken`, dto, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((err: AxiosError) => {
      const { name, stack, response } = err;

      const { message, statusCode, error } = response.data as CustomErrorResponseType;

      throw new BadRequestException({
        name: name,
        message: message,
        code: statusCode,
        status: error,
        stack: stack,
      });
    });


    return data;
  }


}
