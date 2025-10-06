import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/auth';
import { Permission, hasPermission, Role } from './permissions';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

type ApiHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void;

// Middleware para verificar autenticación
export const withAuth = (handler: ApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await auth.api.getSession({ headers: req.headers });

      if (!session?.user) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      (req as AuthenticatedRequest).user = {
        id: session.user.id,
        email: session.user.email,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: (session.user as any).role as Role,
      };

      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Error de autenticación:', error);
      return res.status(401).json({ error: 'Error de autenticación' });
    }
  };
};

// Middleware para verificar permisos
export const withPermission = (permission: Permission, handler: ApiHandler) => {
  return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const userRole = req.user?.role;

    if (!hasPermission(userRole, permission)) {
      return res
        .status(403)
        .json({ error: 'No tienes permiso para esta acción' });
    }

    return handler(req, res);
  });
};

// Middleware para verificar múltiples permisos (OR)
export const withAnyPermission = (
  permissions: Permission[],
  handler: ApiHandler
) => {
  return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const userRole = req.user?.role;

    const hasAnyPerm = permissions.some((perm) =>
      hasPermission(userRole, perm)
    );

    if (!hasAnyPerm) {
      return res
        .status(403)
        .json({ error: 'No tienes permiso para esta acción' });
    }

    return handler(req, res);
  });
};

// Middleware para verificar múltiples permisos (AND)
export const withAllPermissions = (
  permissions: Permission[],
  handler: ApiHandler
) => {
  return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const userRole = req.user?.role;

    const hasAllPerms = permissions.every((perm) =>
      hasPermission(userRole, perm)
    );

    if (!hasAllPerms) {
      return res
        .status(403)
        .json({ error: 'No tienes todos los permisos necesarios' });
    }

    return handler(req, res);
  });
};