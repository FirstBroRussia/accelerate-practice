import { Request } from 'express';
import { CallHandler, ExecutionContext, Injectable, Logger, LoggerService, NestInterceptor, BadRequestException } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import { validate } from "class-validator";

import { fillDTOWithExcludeExtraneousValues } from '@fitfriends-backend/core';


@Injectable()
export class TransformAndValidateQueryInterceptor implements NestInterceptor {
  private readonly logger: LoggerService = new Logger(TransformAndValidateQueryInterceptor.name);

  constructor (
    private readonly classConstructor: ClassConstructor<any>,
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();

    const transformQuery = fillDTOWithExcludeExtraneousValues(this.classConstructor, req.query);
    const errors = await validate(transformQuery);

    if (errors.length > 0) {
      throw new BadRequestException(errors.toString());
    }

    req.query = transformQuery;


    return next.handle();
  }
}

