import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES } from '../../../common/decorators/auth/validRoles.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRole: string[] = this.reflector.get(ROLES, context.getHandler());

    if (!validRole) return true;
    if (validRole.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new BadRequestException('User not found');

    if (validRole.includes(user.roleUser)) return true;

    throw new ForbiddenException(
      `The user ${user.nameUser} not have a role valid, talk with admin`,
    );
  }
}
