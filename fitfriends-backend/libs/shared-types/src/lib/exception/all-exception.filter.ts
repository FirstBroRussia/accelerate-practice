import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { AxiosError } from 'axios';


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    if (exception instanceof AxiosError) {

      let responseBody;

      if (!exception.response?.status) {
        console.error(exception.cause, exception.stack);

        responseBody = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
          message: exception.cause,
          errorType: null,
        };
      } else {
        console.error(exception.response.data, exception.stack);

        responseBody = {
          statusCode: +exception.response.status,
          timestamp: new Date().toISOString(),
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
          message: exception.response.data.message,
          errorType: null,
        };
      }

      httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);

      return;
    } else if (exception instanceof RpcException) {
      console.error(exception.message);

      const responseBody = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        message: exception.message,
        errorType: null,
      };


      httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);

      return;
    } else {
      console.error(exception);

      const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

      const errorMessage =
        exception instanceof HttpException
          ? exception.message
          : `INTERNAL_SERVER_ERROR`;

      const errorType =
        exception instanceof HttpException
          ? ((exception as HttpException).getResponse() as any).error
          : null;

      const responseBody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        message: errorMessage,
        errorType: errorType || null,
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
  }
}

