import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { and, eq } from 'drizzle-orm';
import { memberships, organizations } from '@repo/db';
import {
  getPermissions,
  hasPermission,
  type Permission,
} from '@repo/auth/src/permissions';
import type { Role } from '@repo/auth/src/roles';
import { REQUIRED_PERMISSION_KEY } from '../decorators/require-permission.decorator';

@Injectable()
export class OrganizationAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('DRIZZLE_DB') private readonly db: any,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const organizationId = request.headers['x-organization-id'];

    if (
      typeof organizationId !== 'string' ||
      organizationId.trim().length === 0
    ) {
      throw new BadRequestException('Missing X-Organization-Id header.');
    }

    const authUser = request.user;
    if (!authUser?.userId) {
      throw new ForbiddenException('Missing authenticated user context.');
    }

    const [membership] = await this.db
      .select({
        membershipId: memberships.id,
        organizationId: memberships.organizationId,
        organizationName: organizations.name,
        role: memberships.role,
        status: memberships.status,
      })
      .from(memberships)
      .innerJoin(
        organizations,
        eq(memberships.organizationId, organizations.id),
      )
      .where(
        and(
          eq(memberships.userId, authUser.userId),
          eq(memberships.organizationId, organizationId),
          eq(memberships.status, 'active'),
        ),
      )
      .limit(1);

    if (!membership) {
      throw new ForbiddenException(
        'The authenticated user does not have an active membership in the requested organization.',
      );
    }

    const requiredPermission = this.reflector.getAllAndOverride<
      Permission | undefined
    >(REQUIRED_PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    const role = membership.role as Role;
    if (requiredPermission && !hasPermission(role, requiredPermission)) {
      throw new ForbiddenException(
        `Missing permission "${requiredPermission}" for this organization.`,
      );
    }

    request.organizationId = membership.organizationId;
    request.membership = {
      id: membership.membershipId,
      role,
      permissions: getPermissions(role),
      organizationName: membership.organizationName,
    };
    request.user = {
      ...authUser,
      organizationId: membership.organizationId,
      role,
    };

    return true;
  }
}
