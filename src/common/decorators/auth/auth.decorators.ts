import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validRoles } from 'src/common/interfaces/globla.interfaces';
import { validRole } from './validRoles.decorator';
import { UserRoleGuard } from '../../../users/guards/user-role/user-role.guard';

export function Auth(...roles: validRoles[]) {
  return applyDecorators(
    validRole(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
