import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoachCreateUserDto, FindUsersQuery, GetFriendsListQuery, JwtUserPayloadDto, LoginUserDto, StudentCreateUserDto, UpdateCoachUserInfoDto, UpdateStatusRequestTrainingDto, UpdateStudentUserInfoDto } from '@fitfriends-backend/shared-types';
import { compareHash } from '@fitfriends-backend/core';
import { UsersMicroserviceEnvInterface } from '../assets/interface/users-microservice-env.interface';
import { UsersRepositoryService } from './users-repository/users-repository.service';
import { BaseUserEntity, CoachUserEntity, StudentUserEntity } from './users-repository/entity/user.entity';
import { RequestTrainingEntity } from './users-repository/entity/request-training.entity';


@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor (
    private readonly config: ConfigService<UsersMicroserviceEnvInterface>,
    private readonly usersRepository: UsersRepositoryService,
  ) { }


  public async checkEmail(email: string): Promise<boolean> {
    const result = await this.usersRepository.findUserByEmail(email);

    return result ? true : false;
  }

  public async create(dto: StudentCreateUserDto | CoachCreateUserDto): Promise<StudentUserEntity | CoachUserEntity> {
    const { email } = dto;

    const existUser = await this.usersRepository.findUserByEmail(email);

    if (existUser) {
      throw new BadRequestException(`Пользователь с email: ${email} уже создан.`);
    }


    return await this.usersRepository.createUser(dto);
  }

  public async login(dto: LoginUserDto): Promise<JwtUserPayloadDto> {
    const { email, password } = dto;

    const existUser = await this.usersRepository.findUserByEmail(email);

    if (!existUser) {
      throw new BadRequestException(`Пользователя с email: ${email} не существует.`);
    }

    const isVerifyPassword = await compareHash(password, existUser.passwordHash);

    if (!isVerifyPassword) {
      throw new BadRequestException(`Неверный пароль.`);
    }

    const jwtUserPayload: JwtUserPayloadDto = {
      sub: existUser._id,
      email: existUser.email,
      role: existUser.role,
    };


    return jwtUserPayload;
  }

  public async findByEmail(email: string): Promise<BaseUserEntity | null> {
    const existUser = await this.usersRepository.findUserByEmail(email);

    if (!existUser) {
      throw new BadRequestException(`Данного пользователя с email: ${email} не найдено.`);
    }


    return existUser;
  }

  public async findById(id: string): Promise<BaseUserEntity | null> {
    const existUser = await this.usersRepository.findUserById(id);

    if (!existUser) {
      throw new BadRequestException(`Данного пользователя с ID: ${id} не найдено.`);
    }


    return existUser;
  }

  public async updateUserInfo(userId: string, dto: UpdateStudentUserInfoDto | UpdateCoachUserInfoDto): Promise<BaseUserEntity | null> {
    await this.findById(userId);

    return await this.usersRepository.updateUserData(userId, dto);
  }

  public async getUsersList(query: FindUsersQuery): Promise<BaseUserEntity[]> {
    return await this.usersRepository.findUsersByQueryParams(query);
  }

  public async getUsersListByIds(ids: string[]): Promise<BaseUserEntity[]> {
    return await this.usersRepository.getUsersListByIds(ids);
  }

  public async addFriend(creatorUserId: string, friendUserId: string): Promise<void> {
    const creatorUser = await this.findById(creatorUserId);
    const targetPrefriendUser = await this.findById(friendUserId);

    if (creatorUser.role === 'Coach' && targetPrefriendUser.role === 'Student') {
      throw new BadRequestException('Вы не имеете права добавлять пользователя с ролью "Пользователь" к себе в друзья.');
    }

    const checkCreatorUser = await this.usersRepository.checkFriendUserByFriendsList(creatorUserId, friendUserId);
    const checkTargetFriendUser = await this.usersRepository.checkFriendUserByFriendsList(friendUserId, creatorUserId);

    if (checkCreatorUser) {
      throw new BadRequestException('Данный пользователь уже добавлен в список ваших друзей');
    }
    if (checkTargetFriendUser) {
      throw new BadRequestException('Вы уже добавлены в список друзей данного человека, которого хотите добавить в друзья. Обратитесь в поддержку по данной проблеме.');
    }

    await this.usersRepository.addFriend(creatorUserId, friendUserId);
    await this.usersRepository.addFriend(friendUserId, creatorUserId);


    return;
  }

  public async removeFriend(creatorUserId: string, friendUserId: string): Promise<void> {
    await this.findById(creatorUserId);
    await this.findById(friendUserId);

    const checkCreatorUser = await this.usersRepository.checkFriendUserByFriendsList(creatorUserId, friendUserId);
    const checkTargetFriendUser = await this.usersRepository.checkFriendUserByFriendsList(friendUserId, creatorUserId);

    if (!checkCreatorUser) {
      throw new BadRequestException('Данного пользователя нету в списке ваших друзей');
    }
    if (!checkTargetFriendUser) {
      throw new BadRequestException('Вас нету в списке друзей данного пользователя, которого вы хотите удалить из друзей. Обратитесь в поддержку по данной проблеме.');
    }

    await this.usersRepository.removeFriend(creatorUserId, friendUserId);
    await this.usersRepository.removeFriend(friendUserId, creatorUserId);


    return;
  }

  public async getFriendsList(creatorUserId: string, query: GetFriendsListQuery): Promise<Pick<BaseUserEntity, 'friends'>> {
    const result = await this.usersRepository.getFriendsList(creatorUserId, query);

    if (!result) {
      throw new BadRequestException(`Данного пользователя с ID: ${creatorUserId} не найдено.`);
    }


    return result;
  }

  public async getRequestTrainingFriendList(creatorUserId: string, friendIds: string[]): Promise<RequestTrainingEntity[]> {
    return await this.usersRepository.getRequestTrainingFriendList(creatorUserId, friendIds);
  }

  public async createRequestTraining(creatorUserId: string, targetUserId: string): Promise<RequestTrainingEntity> {
    const existFriend = await this.usersRepository.checkFriendUserByFriendsList(creatorUserId, targetUserId);

    if (!existFriend) {
      throw new BadRequestException('Этот пользователь не является вашим другом. Вы не можете прислать ему запрос на проведение тренировки.');
    }

    const existTargetUser = await this.findById(targetUserId);

    if (existTargetUser.role === 'Student') {
      if (!(existTargetUser as StudentUserEntity).trainingIsReady) {
        throw new BadRequestException('Данный пользователь не готов к совместной тренировке.');
      }
    } else if (existTargetUser.role === 'Coach') {
      if (!(existTargetUser as CoachUserEntity).personalTraining) {
        throw new BadRequestException('Данный тренер не готов к персональной тренировке.');
      }
    }

    const existDocument_1 = await this.usersRepository.getRequestTrainingDocumentByCreatorUserIdAndTargetUserId(creatorUserId, targetUserId);

    if (existDocument_1) {
      throw new BadRequestException('Данный запрос на совместную/персональную тренировку уже существует.');
    }

    const result = await this.usersRepository.createRequestTraining(creatorUserId, targetUserId);

    this.logger.log('Создан новый запрос на совместную/персональную тренировку.');


    return result;
  }

  public async updateStatusRequestTraining(requestId: string, targetUserId: string, dto: UpdateStatusRequestTrainingDto): Promise<any> {
    const { status } = dto;

    console.log(requestId);
    console.log(targetUserId);

    const existDocument = await this.usersRepository.getRequestTrainingDocumentById(requestId);

    if (!existDocument) {
      throw new BadRequestException(`Данной заявки с ID: ${requestId} не существует.`);
    }

    const updatedDocument = await this.usersRepository.updateStatusRequestTrainingDocumentByIdAndTargetUserId(requestId, targetUserId, status);

    if (!updatedDocument) {
      throw new ForbiddenException('Вы не имеете право изменять статус данной заявки.');
    }

    this.logger.log(`Заявка на тренировку с ID: ${requestId}; изменен статус на новый: "${status}".`);


    return updatedDocument;
  }


}
