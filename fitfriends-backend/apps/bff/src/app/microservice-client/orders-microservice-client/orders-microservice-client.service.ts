import axios, { AxiosError } from 'axios';

import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { BalanceOrdersFromOrdersMicroserviceDto, CoachOrderInfoRdo, CreateOrderDto, CustomErrorResponseType, GetDocumentQuery, StudentOrderInfoRdo, UserRoleType } from '@fitfriends-backend/shared-types';

import { BffMicroserviceEnvInterface } from 'apps/bff/src/assets/interface/bff-microservice-env.interface';


@Injectable()
export class OrdersMicroserviceClientService {
  private readonly logger = new Logger(OrdersMicroserviceClientService.name);

  constructor (
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
  ) { }


  public async createOrder(creatorUserId: string, targetTrainingCoachUserId: string, dto: CreateOrderDto): Promise<StudentOrderInfoRdo> {
    const { data } = await axios.post(`${this.config.get('ORDERS_MICROSERVICE_URL')}/orders/${creatorUserId}/${targetTrainingCoachUserId}`, dto, {
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

  public async getOrders(creatorUserId: string, dto: GetDocumentQuery): Promise<(StudentOrderInfoRdo | CoachOrderInfoRdo)[]> {
    const { data } = await axios.post(`${this.config.get('ORDERS_MICROSERVICE_URL')}/orders/${creatorUserId}`, dto, {
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

  public async getOrderByIdAndCreatorUserId(orderId: string, creatorUserId: string): Promise<StudentOrderInfoRdo | CoachOrderInfoRdo> {
    const { data } = await axios.get(`${this.config.get('ORDERS_MICROSERVICE_URL')}/orders/id/${orderId}/${creatorUserId}`, {
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

  public async getBalance(studentUserId: string): Promise<BalanceOrdersFromOrdersMicroserviceDto> {
    const { data } = await axios.get(`${this.config.get('ORDERS_MICROSERVICE_URL')}/orders/balance/${studentUserId}`, {
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
