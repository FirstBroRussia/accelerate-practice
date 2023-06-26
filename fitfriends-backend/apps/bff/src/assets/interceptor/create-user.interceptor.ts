import { createWriteStream } from 'fs';
import path from 'path';


import nanoid from 'nanoid-esm';
import busboy from 'busboy';
import { Request } from 'express';
import * as mime from 'mime-types';


import { BadRequestException, CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BffMicroserviceEnvInterface } from '../interface/bff-microservice-env.interface';
import { checkString } from '@fitfriends-backend/core';
import { ExpressUploadFileType, UserRoleEnum } from '@fitfriends-backend/shared-types';
import { isEmail } from 'class-validator';
import { UsersMicroserviceClientService } from '../../app/microservice-client/users-microservice-client/users-microservice-client.service';


const ONE_MEGABYTE_SIZE = 1024 * 1024; // В мегабайтах


type FileOptionsType = {
  fieldName: string,
  count: number,
  limits?: {
    extension?: string | RegExp,
    fileSize?: number,
  },
};

type FileStreamCompletedType = {
  fieldname: string,
  originalname: string,
  encoding: string,
  mimetype: string,
  filename: string,
  path: string,
  size: number,
  buffer: Buffer,
};


// @Injectable()
export class CreateUserInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CreateUserInterceptor.name);

  constructor (
    private files: FileOptionsType[],
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
    private readonly usersMicroserviceClient: UsersMicroserviceClientService,
  ) { }


  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest<Request>();


    return await new Promise((resolve, reject) => {
      const bb = busboy({ headers: request.headers });

      const files: ExpressUploadFileType[] = [];
      const fields: Record<string, unknown> = {}
      const fileCounts: Record<string, number> = {};

      const streamFiles: FileStreamCompletedType[] = [];


      let isErrorOccurred = false;


      bb.on('file', async (fieldname, stream, info) => {
        const targetFileOptions = this.files.find((item) => item.fieldName === fieldname);

        if (!targetFileOptions) {
          stream.resume();

          return;
        }

        const { fieldName, count, limits } = targetFileOptions;

        if (!fileCounts[fieldName]) {
          fileCounts[fieldName] = 1;
        } else {
          fileCounts[fieldName] += 1;
        }

        if (fileCounts[fieldName] > count) {
          isErrorOccurred = true;

          const error = new BadRequestException(`Превышено количество переданных файлов в поле ${fieldName}, разрешено ${count} шт.`);
          stream.destroy();
          bb.emit('error', error);

          return;
        }


        const extension = mime.extension(info.mimeType).toString();

        // Проверка на условие по расширению файла
        if (limits && limits.extension) {
          if (!checkString(extension, limits.extension)) {
            isErrorOccurred = true;

            const error = new BadRequestException(`Для поля ${fieldname} разрешен(ы) формат(ы): ${limits.extension}.`);
            stream.destroy();
            bb.emit('error', error);

            return;
          }
        }

        const fileName = nanoid();

        const filePath = path.resolve('./', 'uploads', `${fileName}.${extension}`);


        const chunks: Buffer[] = [];
        let fileSize = 0;


        stream.on('data', (data) => {
          fileSize += data.length;

          // Проверка на ограничение по размеру файла
          if (limits?.fileSize && fileSize > limits.fileSize) {
            isErrorOccurred = true;

            const error = new BadRequestException(`Ограничение размера изображения у поля ${fieldName} в ${limits.fileSize / ONE_MEGABYTE_SIZE} мегабайт.`);
            stream.destroy();
            bb.emit('error', error);


            return;
          }

          chunks.push(data);
        });

        stream.on('error', (err) => {
          isErrorOccurred = true;

          bb.emit('error', err);

          return;
        });

        stream.on('end', () => {
          if (isErrorOccurred) {
            return;
          }

          const fileDataBuffer = Buffer.concat(chunks);

          const fileStream = {
            fieldname: fieldname,
            originalname: info.filename,
            encoding: info.encoding,
            mimetype: info.mimeType,
            filename: `${fileName}.${extension}`,
            path: filePath,
            size: fileDataBuffer.length,
            buffer: fileDataBuffer,
          };

          streamFiles.push(fileStream);
        });

      });


      bb.on('field', (fieldname, value) => {
        fields[fieldname] = value;
      });

      bb.on('finish', async () => {
        if (isErrorOccurred) {
          return;
        }

        const email = fields['email'] as string;

        if (!isEmail(email)) {
          isErrorOccurred = true;

          const error = new BadRequestException(`Невалидный email: ${email}.`);
          bb.emit('error', error);

          return;
        }

        try {
          await this.usersMicroserviceClient.checkEmail(email);
        } catch (err) {
          isErrorOccurred = true;

          const error = new BadRequestException(`Пользователь с email: ${email} уже создан.`);
          bb.emit('error', error);

          return;
        }


        for (let index = 0; index < streamFiles.length; index++) {
          const { fieldname, originalname, filename, encoding, mimetype, path, size, buffer } = streamFiles[index];


          if (fields['role'] === UserRoleEnum.Student) {
            if (fieldname === 'avatar') {
              fields['avatar'] = path.replace(process.cwd(), '').replace(/\\+/g, '/');
            }
          } else if (fields['role'] === UserRoleEnum.Coach) {
            if (fieldname === 'avatar') {
              fields['avatar'] = path.replace(process.cwd(), '').replace(/\\+/g, '/');
            }
            if (fieldname === 'certificates') {
              fields['certificates'] = path.replace(process.cwd(), '').replace(/\\+/g, '/');
            }
          }

          const writeStream = createWriteStream(path);

          writeStream.on('error', () => {
            isErrorOccurred = true;

            const error = new BadRequestException(`Ошибка при записи файла: ${originalname} в файловую систему.`);
            writeStream.destroy();
            bb.emit('error', error);

            return;
          });

          writeStream.write(buffer);
          writeStream.end();

          const fileInfo = {
            fieldname: fieldname,
            originalname: originalname,
            filename: filename,
            encoding: encoding,
            mimetype: mimetype,
            path: path.replace(process.cwd(), ''),
            size: size,
          };

          files.push(fileInfo);
        }

        (request as Request & { files: any }).files = files;
        request.body = fields;

        resolve(true);
      });

      bb.on('error', (err) => {
        reject(err);

        return;
      });

      bb.on('close', () => {

        return;
      });

      request.pipe(bb);

    }).then(() => {
      return next.handle();
    }).catch((err) => {
      throw new BadRequestException(err);
    });


  }
}

