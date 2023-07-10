import * as jose from 'jose';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtMicroserviceEnvInterface } from '../assets/interface/jwt-microservice-env.interface';
import { JwtErrorMessageEnum, JwtUserPayloadDto, JwtUserPayloadRdo, LogoutedUserDto } from '@fitfriends-backend/shared-types';
import { JwtRepositoryService } from './jwt-repository/jwt-repository.service';
import { LogoutedUserEntity } from './jwt-repository/entity/logouted-user.entity';


@Injectable()
export class JwtService {
  private readonly algorithm: string = 'HS256';

  constructor (
    private readonly config: ConfigService<JwtMicroserviceEnvInterface>,
    private readonly jwtRepository: JwtRepositoryService,
  ) { }

  public async generateAccessToken(payload: JwtUserPayloadDto): Promise<string> {
    const secret = new TextEncoder().encode(this.config.get('ACCESS_TOKEN_SECRET'));

    return await new jose.SignJWT({...payload})
      .setProtectedHeader({ alg: this.algorithm })
      .setIssuedAt()
      .setExpirationTime(String(this.config.get('ACCESS_TOKEN_EXPIRATION_TIME')))
      .sign(secret);
  }

  public async generateRefreshToken(payload: JwtUserPayloadDto): Promise<string> {
    const secret = new TextEncoder().encode(this.config.get('REFRESH_TOKEN_SECRET'));

    return await new jose.SignJWT({...payload})
      .setProtectedHeader({ alg: this.algorithm })
      .setIssuedAt()
      .setExpirationTime(String(this.config.get('REFRESH_TOKEN_EXPIRATION_TIME')))
      .sign(secret);
  }

  public async verifyAccessToken(token: string): Promise<JwtUserPayloadDto> {
    const secret = new TextEncoder().encode(this.config.get('ACCESS_TOKEN_SECRET'));

    try {
      const { payload } = await jose.jwtVerify(token, secret);

      return payload as JwtUserPayloadDto;

    } catch (error) {
      if (error instanceof jose.errors.JWTExpired) {
        throw new UnauthorizedException(JwtErrorMessageEnum.ExpiredAccessToken);
      }

      throw new UnauthorizedException(JwtErrorMessageEnum.InvalidAccessToken);
    }
  }

  public async verifyRefreshToken(token: string): Promise<JwtUserPayloadRdo> {
    const secret = new TextEncoder().encode(this.config.get('REFRESH_TOKEN_SECRET'));

    try {
      const { payload } = await jose.jwtVerify(token, secret);

      return payload as unknown as JwtUserPayloadRdo;

    } catch (error) {
      if (error instanceof jose.errors.JWTExpired) {
        throw new UnauthorizedException(JwtErrorMessageEnum.ExpiredRefreshToken);
      }

      throw new UnauthorizedException(JwtErrorMessageEnum.InvalidRefreshToken);
    }
  }

  public async revokeLogoutedRefreshToken(dto: LogoutedUserDto): Promise<LogoutedUserEntity> {
    return await this.jwtRepository.createLogoutedUser(dto);
  }

  public async checkLogoutedRefreshToken(refreshToken: string): Promise<boolean> {
    return await this.jwtRepository.checkLogoutedUser(refreshToken);
  }


}

