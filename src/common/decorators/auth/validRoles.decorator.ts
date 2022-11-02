import { SetMetadata } from '@nestjs/common';
import { validRoles } from 'src/common/interfaces/globla.interfaces';

export const ROLES = 'roles';

export const validRole = (...args: validRoles[]) => {
  return SetMetadata(ROLES, args);
};
