import { BadRequestException, Body, Controller, Post, Req, UseInterceptors } from '@nestjs/common';


import { CoachCreateUserDto, CoachCreateUserRdo, ExpressUploadFileType, LoginUserDto, StudentCreateUserDto, StudentCreateUserRdo, TransformAndValidateDtoInterceptor, UserRoleEnum } from '@fitfriends-backend/shared-types';

import { BffService } from './bff.service';
import { ConfigService } from '@nestjs/config';
import { BffMicroserviceEnvInterface } from '../assets/interface/bff-microservice-env.interface';
import { CreateUserInterceptor } from '../assets/interceptor/create-user.interceptor';
import { Request } from 'express';
import { isEmail, isEnum, validate } from 'class-validator';
import { fillDTOWithExcludeExtraneousValues, fillRDO } from '@fitfriends-backend/core';
import { UsersMicroserviceClientService } from './users-microservice-client/users-microservice-client.service';


@Controller('')
export class BffController {
  constructor(
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
    private readonly bffService: BffService,
    private readonly usersMicroserviceClient: UsersMicroserviceClientService,
  ) { }


  @Post('checkemail')
  public async checkEmail(@Body('email') email: string): Promise<boolean> {
    if (!isEmail(email)) {
      throw new BadRequestException(`Передан невалидный email: ${email}.`);
    }

    return await this.usersMicroserviceClient.checkEmail(email);
  }

  @Post('/register')
  @UseInterceptors(new CreateUserInterceptor([
    {
      fieldName: 'avatar',
      count: 1,
      limits: {
        extension: /^(jpg|png|jpeg)$/,
        fileSize: 1 * 1024 * 1024, // В мегабайтах
      },
    },
    {
      fieldName: 'certificates',
      count: 1,
      limits: {
        extension: /^pdf$/,
      },
    },
  ], new ConfigService, new UsersMicroserviceClientService(new ConfigService())))
  public async register(@Req() req: Request & { files: ExpressUploadFileType[] }, @Body() dto: StudentCreateUserDto | CoachCreateUserDto) {
    const { role } = dto;

    if (!isEnum(role, UserRoleEnum)) {
      throw new BadRequestException('Невалидные данные, в том числе поле "role"');
    }

    const transformDto = role === 'Student' ? fillDTOWithExcludeExtraneousValues(StudentCreateUserDto, dto)
    : fillDTOWithExcludeExtraneousValues(CoachCreateUserDto, dto);

    const errors = await validate(transformDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors.toString());
    }

    const response = await this.usersMicroserviceClient.registerUser(dto);

    const rdo = role === 'Student' ? fillRDO(StudentCreateUserRdo, response)
    : fillRDO(CoachCreateUserRdo, response);


    return rdo;

  }

  @Post('login')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(LoginUserDto))
  public async login(@Body() dto: LoginUserDto): Promise<any> {
    const result = await this.usersMicroserviceClient.login(dto);

    return result;
  }

}
