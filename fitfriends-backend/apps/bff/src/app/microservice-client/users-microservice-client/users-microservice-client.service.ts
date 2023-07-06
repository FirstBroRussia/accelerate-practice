import axios, { AxiosError } from 'axios';

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CoachCreateUserDto, StudentCreateUserDto, CoachCreateUserRdo, StudentCreateUserRdo, CustomErrorResponseType, LoginUserDto, JwtUserPayloadDto, StudentUserRdo, CoachUserRdo, UpdateStudentUserInfoDto, UpdateCoachUserInfoDto, JwtRefreshTokenDto, GetFriendsListQuery, FriendUserInfoRdo, UpdateStatusRequestTrainingDto, GetUserListDto } from '@fitfriends-backend/shared-types';
import { BffMicroserviceEnvInterface } from 'apps/bff/src/assets/interface/bff-microservice-env.interface';


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

  public async login(dto: LoginUserDto): Promise<JwtUserPayloadDto> {
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

  public async getUserInfo(userId: string): Promise<StudentUserRdo | CoachUserRdo> {
    const { data } = await axios.get(`${this.config.get('USERS_MICROSERVICE_URL')}/users/user/${userId}`, {
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

  public async updateUserInfo(userId: string, dto: UpdateStudentUserInfoDto | UpdateCoachUserInfoDto): Promise<UpdateStudentUserInfoDto | UpdateCoachUserInfoDto> {
    const { data } = await axios.patch(`${this.config.get('USERS_MICROSERVICE_URL')}/users/user/${userId}`, dto, {
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

  public async getUsersList(url: string): Promise<UpdateStudentUserInfoDto | UpdateCoachUserInfoDto> {
    const { data } = await axios.get(`${this.config.get('USERS_MICROSERVICE_URL')}${url}`, {
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

  public async addFriend(friendUserId: string, creatorUserId: string): Promise<void> {
    const { data } = await axios.get(`${this.config.get('USERS_MICROSERVICE_URL')}/users/addfriend/${friendUserId}/${creatorUserId}`, {
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

  public async removeFriend(friendUserId: string, creatorUserId: string): Promise<void> {
    const { data } = await axios.get(`${this.config.get('USERS_MICROSERVICE_URL')}/users/removefriend/${friendUserId}/${creatorUserId}`, {
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

  public async getFriendsList(creatorUserId: string, dto: GetFriendsListQuery): Promise<FriendUserInfoRdo[]> {
    const { data } = await axios.post(`${this.config.get('USERS_MICROSERVICE_URL')}/users/friendslist/${creatorUserId}`, dto, {
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

  public async createRequestTraining(creatorUserId: string, targetUserId: string): Promise<FriendUserInfoRdo[]> {
    const { data } = await axios.get(`${this.config.get('USERS_MICROSERVICE_URL')}/users/requesttraining/create/${creatorUserId}/${targetUserId}`, {
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

  public async updateStatusRequestTraining(requestId: string, targetUserId: string, dto: UpdateStatusRequestTrainingDto): Promise<FriendUserInfoRdo[]> {
    const { data } = await axios.post(`${this.config.get('USERS_MICROSERVICE_URL')}/users/requesttraining/updatestatus/${requestId}/${targetUserId}`, dto, {
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

  public async getUserList(dto: GetUserListDto): Promise<StudentUserRdo[]> {
    const { data } = await axios.post(`${this.config.get('USERS_MICROSERVICE_URL')}/users/userlist`, dto, {
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
