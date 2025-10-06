import { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import {
  sendSuccess,
  sendError,
  requirePermission,
  methodNotAllowed,
  calculatePagination,
  parseQueryParam,
  ApiResponse,
} from '@/lib/api/helpers';
import {
  listUsersQuerySchema,
} from '@/lib/validations/user';
import { Permission } from '@/lib/rbac/permissions';
import prisma from '@/lib/prisma';

/**
 * GET /api/users - List users (Admin only)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  }

  return methodNotAllowed(res, ['GET']);
}

/**
 * GET /api/users
 * List users with filtering, sorting, and pagination
 * Admin only
 */
async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Require VIEW_USERS permission
    const session = await requirePermission(req, res, Permission.VIEW_USERS);
    if (!session) return;

    // Parse and validate query parameters
    const queryParams = {
      page: parseQueryParam(req.query.page),
      limit: parseQueryParam(req.query.limit),
      search: parseQueryParam(req.query.search),
      role: parseQueryParam(req.query.role),
      sortBy: parseQueryParam(req.query.sortBy),
      sortOrder: parseQueryParam(req.query.sortOrder),
    };

    const validatedQuery = listUsersQuerySchema.parse(queryParams);

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Filter by role
    if (validatedQuery.role) {
      where.role = validatedQuery.role;
    }

    // Search in name or email
    if (validatedQuery.search) {
      where.OR = [
        {
          name: {
            contains: validatedQuery.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: validatedQuery.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Calculate pagination
    const skip = (validatedQuery.page - 1) * validatedQuery.limit;

    // Build order by
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: any = {
      [validatedQuery.sortBy]: validatedQuery.sortOrder,
    };

    // Get total count
    const total = await prisma.user.count({ where });

    // Get users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            movements: true,
          },
        },
      },
      orderBy,
      skip,
      take: validatedQuery.limit,
    });

    // Calculate pagination metadata
    const pagination = calculatePagination(
      validatedQuery.page,
      validatedQuery.limit,
      total
    );

    return sendSuccess(res, users, pagination);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(
        res,
        'Parámetros de consulta inválidos',
        'VALIDATION_ERROR',
        400,
        error.issues
      );
    }

    console.error('Error listing users:', error);
    return sendError(
      res,
      'Error al listar usuarios',
      'INTERNAL_ERROR',
      500
    );
  }
}
