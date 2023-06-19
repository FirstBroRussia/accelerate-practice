import axios, { AxiosError } from 'axios';

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BffMicroserviceEnvInterface } from '../../assets/interface/bff-microservice-env.interface';
import { CoachCreateUserDto, StudentCreateUserDto, CoachCreateUserRdo, StudentCreateUserRdo, CustomErrorResponseType, LoginUserDto } from '@fitfriends-backend/shared-types';


@Injectable()
export class UsersMicroserviceClientService {
  private readonly logger = new Logger(UsersMicroserviceClientService.name);

  constructor (
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
  ) { }


  public async checkEmail(email: string): Promise<boolean> {
    const { data } = await axios.post(`${this.config.get('USERS_MICROSERVICE_URL')}/users/checkemail`, {
      email: email,
    }, {
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

  public async registerUser(dto: StudentCreateUserDto | CoachCreateUserDto): Promise<StudentCreateUserRdo | CoachCreateUserRdo> {
    const { data } = await axios.post(`${this.config.get('USERS_MICROSERVICE_URL')}/users/register`, dto, {
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

  public async login(dto: LoginUserDto): Promise<any> {
    const { data } = await axios.post(`${this.config.get('USERS_MICROSERVICE_URL')}/users/login`, dto, {
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
