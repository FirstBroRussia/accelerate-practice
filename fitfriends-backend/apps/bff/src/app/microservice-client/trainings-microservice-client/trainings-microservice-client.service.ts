import axios, { AxiosError } from 'axios';

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CoachTrainingRdo, CreateCoachTrainingDto, CustomErrorResponseType, FindCoachTrainingsQuery, GetTrainingListByTrainingIdsDto, UpdateCoachTrainingDto, UpdateRatingCoachTrainingDto } from '@fitfriends-backend/shared-types';

import { BffMicroserviceEnvInterface } from 'apps/bff/src/assets/interface/bff-microservice-env.interface';


@Injectable()
export class TrainingsMicroserviceClientService {
  private readonly logger = new Logger(TrainingsMicroserviceClientService.name);

  constructor (
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
  ) { }


  public async createTraining(creatorUserId: string, dto: CreateCoachTrainingDto): Promise<CoachTrainingRdo> {
    const { data } = await axios.post(`${this.config.get('TRAININGS_MICROSERVICE_URL')}/trainings/${creatorUserId}`, dto, {
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

  public async getTrainingById(trainingId: string): Promise<CoachTrainingRdo> {
    const { data } = await axios.get(`${this.config.get('TRAININGS_MICROSERVICE_URL')}/trainings/${trainingId}`, {
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

  public async updateTraining(trainingId: string, creatorUserId: string, dto: UpdateCoachTrainingDto): Promise<CoachTrainingRdo> {
    const { data } = await axios.patch(`${this.config.get('TRAININGS_MICROSERVICE_URL')}/trainings/${trainingId}/${creatorUserId}`, dto, {
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

  public async getTrainingListByTrainingIds(dto: GetTrainingListByTrainingIdsDto): Promise<CoachTrainingRdo[]> {
    const { data } = await axios.post(`${this.config.get('TRAININGS_MICROSERVICE_URL')}/trainings/list/trainingsids`, dto, {
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

  public async getTrainingListByCreatorUserId(creatorUserId: string, dto: FindCoachTrainingsQuery): Promise<CoachTrainingRdo[]> {
    const { data } = await axios.post(`${this.config.get('TRAININGS_MICROSERVICE_URL')}/trainings/list/${creatorUserId}`, dto, {
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

  public async updateRating(trainingId: string, dto: UpdateRatingCoachTrainingDto): Promise<CoachTrainingRdo> {
    const { data } = await axios.post(`${this.config.get('TRAININGS_MICROSERVICE_URL')}/trainings/updaterating/${trainingId}`, dto, {
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
