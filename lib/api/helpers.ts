import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/auth';
import { Permission, hasPermission, Role } from '@/lib/rbac/permissions';

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Send success response
 */
export function sendSuccess<T>(
  res: NextApiResponse<ApiResponse<T>>,
  data: T,
  pagination?: ApiResponse['pagination']
): void {
  res.status(200).json({
    success: true,
    data,
    ...(pagination && { pagination }),
  });
}

/**
 * Send error response
 */
export function sendError(
  res: NextApiResponse<ApiResponse>,
  message: string,
  code: string = 'INTERNAL_ERROR',
  statusCode: number = 500,
  details?: any
): void {
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      ...(details && { details }),
    },
  });
}

/**
 * Validate and get authenticated session
 */
export async function getAuthenticatedSession(req: NextApiRequest) {
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value) {
      headers.set(key, Array.isArray(value) ? value[0] : value);
    }
  });

  const session = await auth.api.getSession({ headers });

  if (!session || !session.user) {
    return null;
  }

  return {
    ...session,
    user: {
      ...session.user,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      role: (session.user as any).role as Role,
    },
  };
}

/**
 * Check if user has required permission
 */
export function checkPermission(
  userRole: Role | undefined,
  permission: Permission
): boolean {
  if (!userRole) return false;
  return hasPermission(userRole, permission);
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<ReturnType<typeof getAuthenticatedSession> | null> {
  const session = await getAuthenticatedSession(req);

  if (!session) {
    sendError(
      res,
      'No autenticado. Por favor inicia sesión.',
      'UNAUTHORIZED',
      401
    );
    return null;
  }

  return session;
}

/**
 * Middleware to require specific permission
 */
export async function requirePermission(
  req: NextApiRequest,
  res: NextApiResponse,
  permission: Permission
): Promise<ReturnType<typeof getAuthenticatedSession> | null> {
  const session = await requireAuth(req, res);

  if (!session) return null;

  if (!checkPermission(session.user.role, permission)) {
    sendError(
      res,
      'No tienes permisos para realizar esta acción.',
      'FORBIDDEN',
      403
    );
    return null;
  }

  return session;
}

/**
 * Handle method not allowed
 */
export function methodNotAllowed(
  res: NextApiResponse,
  allowedMethods: string[]
): void {
  res.setHeader('Allow', allowedMethods.join(', '));
  sendError(
    res,
    `Método no permitido. Métodos permitidos: ${allowedMethods.join(', ')}`,
    'METHOD_NOT_ALLOWED',
    405
  );
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  page: number,
  limit: number,
  total: number
) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Parse query parameters safely
 */
export function parseQueryParam(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}
