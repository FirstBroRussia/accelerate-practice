import { Body, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';

import { JwtService } from './jwt.service';
import { fillRDO } from '@fitfriends-backend/core';
import { JwtAccessTokenDto, JwtAccessTokenRdo, JwtRefreshTokenDto, JwtUserPayloadDto, JwtUserPayloadRdo, JwtValidationPipe, LoginUserRdo, LogoutedUserDto, TransformAndValidateDtoInterceptor } from '@fitfriends-backend/shared-types';
import { HttpStatusCode } from 'axios';


@Controller('jwt')
export class JwtController {
  constructor(
    private readonly jwtService: JwtService,
  ) { }


  @Post('generatetokens')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(JwtUserPayloadDto))
  public async generateTokens(@Body() dto: JwtUserPayloadDto): Promise<LoginUserRdo> {
    const accessToken = await this.jwtService.generateAccessToken(dto);

    const refreshToken = await this.jwtService.generateRefreshToken(dto);

    const rdo: LoginUserRdo = {
      accessToken,
      refreshToken,
    };


    return fillRDO(LoginUserRdo, rdo);
  }

  @Post('verifyaccesstoken')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(JwtAccessTokenDto))
  public async verifyAccessToken(@Body('accessToken', JwtValidationPipe) accessToken: string): Promise<JwtUserPayloadRdo> {
    const result = await this.jwtService.verifyAccessToken(accessToken);


    return fillRDO(JwtUserPayloadRdo, result);
  }

  @Post('updateaccesstoken')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(JwtRefreshTokenDto))
  public async updateAccessToken(@Body('refreshToken', JwtValidationPipe) refreshToken: string): Promise<JwtAccessTokenRdo> {
    await this.jwtService.checkLogoutedRefreshToken(refreshToken);

    const payload = await this.jwtService.verifyRefreshToken(refreshToken) as JwtUserPayloadDto;

    const accessToken = await this.jwtService.generateAccessToken(payload);

    const rdo: JwtAccessTokenRdo = {
      accessToken: accessToken,
    };


    return fillRDO(JwtAccessTokenRdo, rdo);
  }

  @Post('revokelogoutedrefreshtoken')
  @HttpCode(HttpStatusCode.Ok)
  @UseInterceptors(new TransformAndValidateDtoInterceptor(JwtRefreshTokenDto))
  public async revokeLogoutedRefreshToken(@Body('refreshToken', JwtValidationPipe) refreshToken: string): Promise<void> {
    const jwtUserPayload = await this.jwtService.verifyRefreshToken(refreshToken);

    const logoutedUserDto: LogoutedUserDto = {
      refreshToken: refreshToken,
      exp: jwtUserPayload.exp,
    };

    await this.jwtService.revokeLogoutedRefreshToken(logoutedUserDto);

    return;
  }

  @Post('checklogoutedrefreshtoken')
  @HttpCode(HttpStatusCode.Ok)
  @UseInterceptors(new TransformAndValidateDtoInterceptor(JwtRefreshTokenDto))
  public async checkLogoutedRefreshToken(@Body('refreshToken', JwtValidationPipe) refreshToken: string): Promise<void> {
    await this.jwtService.checkLogoutedRefreshToken(refreshToken);

    return;
  }


}
