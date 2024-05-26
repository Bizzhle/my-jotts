import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestContextMiddleware } from '../../app/middleware/request-context.middleware';
import { Permission } from '../../permissions/entities/permission.entity';
import { Permission as PermissionEnum } from '../../permissions/enums/permissions.enum';

@Injectable()
export class UserPermissionService {
  constructor(
    private readonly request: RequestContextMiddleware,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
  ) {}
  public async currentUserHasPermission(permission: PermissionEnum): Promise<boolean> {
    const userid = this.request;
    if (!userid) return false;

    const hasPermission = await this.permissionRepository
      .createQueryBuilder('p')
      .innerJoin('role_permission', 'rp', 'rp.permission_id = p.id')
      .innerJoin('role', 'r', 'r.id = rp.role_id')
      .innerJoin('user_account_role', 'uar', 'r.id = uar.role_id')
      .where('uar.user_id = :userid and p.name = :permsission', { userid, permission });
    return;
  }

  // public static getPermissionList(userAccount: Readonly<UserAccount>): string[] {
  //   if (!userAccount.roles) {
  //     return [];
  //   }

  //   const getRolePermissionNames = (role: Role) => (role.permissions || []).map((p) => p.name);
  //   const combinedPermissions = userAccount.roles.reduce(
  //     (permissions: string[], role: Role) => [...permissions, ...getRolePermissionNames(role)],
  //     [],
  //   );
  //   const clearPermissions = new Set(combinedPermissions);

  //   return [...clearPermissions];
  // }
}
