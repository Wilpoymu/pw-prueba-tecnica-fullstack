import { authClient } from '@/lib/auth/client';
import {
  Permission,
  Role,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from './permissions';

export const usePermissions = () => {
  const { data: session } = authClient.useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role as Role | undefined;

  return {
    role: userRole,
    isAdmin: userRole === Role.ADMIN,
    isUser: userRole === Role.USER,
    can: (permission: Permission) => hasPermission(userRole, permission),
    canAny: (permissions: Permission[]) =>
      hasAnyPermission(userRole, permissions),
    canAll: (permissions: Permission[]) =>
      hasAllPermissions(userRole, permissions),
  };
};
