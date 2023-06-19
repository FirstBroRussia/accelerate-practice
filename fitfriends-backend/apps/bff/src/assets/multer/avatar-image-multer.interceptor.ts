import { createWriteStream, unlink } from 'fs';
import path from 'path';


import nanoid from 'nanoid-esm';
import busboy from 'busboy';
import { Request } from 'express';
import * as mime from 'mime-types';


import { BadRequestException, CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BffMicroserviceEnvInterface } from '../interface/bff-microservice-env.interface';


const REGEX_FORMAT_AVATAR_FILE = /^(jpg|png)$/;
const ONE_MEGABYTE_SIZE = 1024 * 1024; // В мегабайтах


// export const getCreateUserAvatarImageMulterOptions = (uploadDir: string): MulterOptions => ({
//   storage: diskStorage({
//     destination: uploadDir,
//     filename(req, file, callback) {
//       if (!REGEX_FORMAT_AVATAR_FILE.test(file.originalname)) {
//         throw new BadRequestException('Формат изображения не валиден. Только .jpg и .png');
//       }

//       const extension = mime.extension(file.mimetype);
//       const filename = nanoid();
//       callback(null, `${filename}.${extension}`);
//     },
//   }),
// });


@Injectable()
export class AvatarImageMulterInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AvatarImageMulterInterceptor.name);

  constructor (
    private nameField: string,
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest<Request>();

    console.log('OPEN INTERCEPTOR');


    return new Promise((resolve, reject) => {
      const bb = busboy({ headers: request.headers });
      const files: any[] = [];
      const fields: Record<string, unknown> = {}

      let isErrorOccurred = false;


      bb.on('file', async (fieldname, stream, info) => {
        if (fieldname !== this.nameField) {
          stream.resume();

          return;
        }

        const extension = mime.extension(info.mimeType);


        if (!REGEX_FORMAT_AVATAR_FILE.test(extension as string)) {
          isErrorOccurred = true;
          stream.resume();
          reject(`Формат изображения не валиден. Только .jpg и .png`);

          return;
        }

        const filename = nanoid();

        const filePath = path.resolve('./', 'uploads', `${filename}.${extension}`);

        const chunks: any[] = [];
        let fileSize = 0;

        stream.on('data', (data) => {
          fileSize += data.length;

          if (fileSize > 1 * Number(this.config.get('AVATAR_FILE_SIZE_LIMIT')) * ONE_MEGABYTE_SIZE) {
            isErrorOccurred = true;
            stream.resume();
            reject(`Превышен размер изображения ${this.config.get('AVATAR_FILE_SIZE_LIMIT')} мегабайт`);

            return;
          }

          chunks.push(data);
        });

        stream.on('error', (err) => {
          isErrorOccurred = true;
          stream.destroy();
          bb.destroy();
          reject(err);
        });

        stream.on('end', () => {
          if (isErrorOccurred) {
            stream.destroy();
            bb.destroy();
            reject();

            return;
          }

          const fileData = Buffer.concat(chunks);
          const writeStream = createWriteStream(filePath);

          writeStream.on('error', (err) => {
            stream.destroy();
            bb.destroy();
            unlink(filePath, (err: any) => {
                if (err) {
                  this.logger.error(err);
                }
            });
            reject(err);
          });

          writeStream.write(fileData);
          writeStream.end();

          const fileInfo = {
            fieldname: `${filename}.${extension}`,
            originalname: fieldname,
            encoding: info.encoding,
            mimetype: info.mimeType,
            filename: `${filename}.${extension}`,
            path: filePath.replace(process.cwd(), ''),
            size: fileData.length,
          };

          files.push(fileInfo);

          stream.destroy();
        });

      });


      bb.on('field', (fieldname, value) => {
        fields[fieldname] = value;
      });

      bb.on('finish', () => {
        (request as Request & { files: any }).files = files;
        request.body = fields;

        resolve(true);
      });

      bb.on('error', (err) => {
        bb.destroy();
        reject(err);
      });

      request.pipe(bb);

    }).then(() => {
      return next.handle();
    }).catch((err) => {
      throw new BadRequestException(err);
    });


  }
}

