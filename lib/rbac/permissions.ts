export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum Permission {
  // Dashboard
  VIEW_DASHBOARD = 'view_dashboard',
  // Movimientos
  VIEW_MOVEMENTS = 'view_movements',
  CREATE_MOVEMENT = 'create_movement',
  EDIT_MOVEMENT = 'edit_movement',
  DELETE_MOVEMENT = 'delete_movement',

  // Usuarios
  VIEW_USERS = 'view_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',

  // Reportes
  VIEW_REPORTS = 'view_reports',
  EXPORT_REPORTS = 'export_reports',
}

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [Permission.VIEW_DASHBOARD, Permission.VIEW_MOVEMENTS],
  [Role.ADMIN]: [
    // Dashboard
    Permission.VIEW_DASHBOARD,
    // Movimientos
    Permission.VIEW_MOVEMENTS,
    Permission.CREATE_MOVEMENT,
    Permission.EDIT_MOVEMENT,
    Permission.DELETE_MOVEMENT,
    // Usuarios
    Permission.VIEW_USERS,
    Permission.EDIT_USERS,
    Permission.DELETE_USERS,
    // Reportes
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
  ],
};

export const hasPermission = (
  role: Role | undefined,
  permission: Permission
): boolean => {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) ?? false;
};

export const hasAnyPermission = (
  role: Role | undefined,
  permissions: Permission[]
): boolean => {
  if (!role) return false;
  return permissions.some((permission) =>
    rolePermissions[role]?.includes(permission)
  );
};

export const hasAllPermissions = (
  role: Role | undefined,
  permissions: Permission[]
): boolean => {
  if (!role) return false;
  return permissions.every((permission) =>
    rolePermissions[role]?.includes(permission)
  );
};
