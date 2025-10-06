export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum Permission {
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

// Definir qué permisos tiene cada rol
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [Permission.VIEW_MOVEMENTS],
  [Role.ADMIN]: [
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

// Función para verificar si un rol tiene un permiso
export const hasPermission = (
  role: Role | undefined,
  permission: Permission
): boolean => {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) ?? false;
};

// Función para verificar si un rol tiene alguno de los permisos
export const hasAnyPermission = (
  role: Role | undefined,
  permissions: Permission[]
): boolean => {
  if (!role) return false;
  return permissions.some((permission) =>
    rolePermissions[role]?.includes(permission)
  );
};

// Función para verificar si un rol tiene todos los permisos
export const hasAllPermissions = (
  role: Role | undefined,
  permissions: Permission[]
): boolean => {
  if (!role) return false;
  return permissions.every((permission) =>
    rolePermissions[role]?.includes(permission)
  );
};