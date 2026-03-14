import { SetMetadata } from '@nestjs/common';
import type { Permission } from '@repo/auth/src/permissions';

export const REQUIRED_PERMISSION_KEY = 'required_permission';

export const RequirePermission = (permission: Permission) =>
  SetMetadata(REQUIRED_PERMISSION_KEY, permission);
