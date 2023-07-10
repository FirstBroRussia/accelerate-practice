import axios, { AxiosError } from 'axios';

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CustomErrorResponseType, CreateCommentForCommentsMicroserviceDto, GetDocumentQuery, CommentsListFromCommentsMicroserviceRdo, CommentFromCommentsMicroserviceRdo } from '@fitfriends-backend/shared-types';
import { BffMicroserviceEnvInterface } from 'apps/bff/src/assets/interface/bff-microservice-env.interface';



@Injectable()
export class CommentsMicroserviceClientService {
  constructor (
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
  ) { }


  public async createComment(dto: CreateCommentForCommentsMicroserviceDto): Promise<CommentFromCommentsMicroserviceRdo> {
    const { data } = await axios.post(`${this.config.get('COMMENTS_MICROSERVICE_URL')}/comments/`, dto, {
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

  public async findCommentsByTrainingId(trainingId: string, dto: GetDocumentQuery): Promise<CommentsListFromCommentsMicroserviceRdo> {
    const { data } = await axios.post(`${this.config.get('COMMENTS_MICROSERVICE_URL')}/comments/${trainingId}`, dto, {
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
