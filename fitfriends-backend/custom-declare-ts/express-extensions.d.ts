import { Request } from 'express';

type ExpressUploadFileType = {
  fieldname: string,
  originalname: string,
  encoding: string,
  mimetype: string,
  filename: string,
  path: string,
  size: number,
};


declare module 'express' {
  interface Request {
    files: ExpressUploadFileType[];
  }
}
