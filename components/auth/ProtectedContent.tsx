import { Permission } from '@/lib/rbac/permissions';
import { usePermissions } from '@/lib/rbac/usePermissions';
import { ReactNode } from 'react';

interface ProtectedContentProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export const ProtectedContent = ({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}: ProtectedContentProps) => {
  const { can, canAny, canAll } = usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (permissions) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
