import { JwtUserPayloadRdo, UserRoleType } from '@fitfriends-backend/shared-types';
import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';


export class CheckAuthUserRoleGuard implements CanActivate {

  constructor (
    private readonly role: UserRoleType,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: JwtUserPayloadRdo }>();

    if (request.user.role !== this.role) {
      throw new ForbiddenException(`Доступ разрешен только пользователю с ролью: ${this.role}.`);
    }

    return true;
  }
}
