import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogoutedUserEntity } from './entity/logouted-user.entity';
import { Model } from 'mongoose';
import { LogoutedUserDto } from '@fitfriends-backend/shared-types';

const ONE_THOUSAND_VALUE = 1000;
const BYPASS_DATABASE_TIME = 24 * 60 * 60 * 1000;


@Injectable()
export class JwtRepositoryService {
  private readonly logger = new Logger(JwtRepositoryService.name);

  constructor (
    @InjectModel(LogoutedUserEntity.name) private readonly logoutedUserModel: Model<LogoutedUserEntity>,
  ) {
    this.bypassDatabase();
  }

  private async bypassDatabase() {
    setInterval(async () => {
      const correctDateNow = Date.now() / ONE_THOUSAND_VALUE;
      await this.logoutedUserModel.deleteMany({
        exp: { $lte: correctDateNow, },
      });
      this.logger.log(`Произведена операция по очистке refresh токенов в БД вышедших из системы пользователей.`);
    }, BYPASS_DATABASE_TIME);
  }

  public async createLogoutedUser(dto: LogoutedUserDto): Promise<LogoutedUserEntity> {
    const newLogoutedUserObj = new LogoutedUserEntity().fillObject(dto);

    const newLogoutedUser = await this.logoutedUserModel.create(newLogoutedUserObj);

    this.logger.log('Новая запись вышедшего из системы refresh токена создана.');


    return newLogoutedUser;
  }

  public async checkLogoutedUser(refreshToken: string): Promise<boolean> {
    const existDoc = await this.logoutedUserModel.findOne({
      refreshToken: refreshToken,
    });

    if (!existDoc) {
      return true;
    }

    throw new BadRequestException('Данный refresh токен уже вышел из системы, авторизуйтесь снова.');
  }

}
