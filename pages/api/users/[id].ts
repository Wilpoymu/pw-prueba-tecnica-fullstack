import { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import {
  sendSuccess,
  sendError,
  requirePermission,
  methodNotAllowed,
  ApiResponse,
} from '@/lib/api/helpers';
import {
  updateUserSchema,
  UpdateUserInput,
} from '@/lib/validations/user';
import { Permission } from '@/lib/rbac/permissions';
import prisma from '@/lib/prisma';

/**
 * GET /api/users/[id] - Get a single user (Admin only)
 * PUT /api/users/[id] - Update a user (Admin only)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return sendError(res, 'ID de usuario inválido', 'INVALID_ID', 400);
  }

  if (req.method === 'GET') {
    return handleGet(req, res, id);
  }

  if (req.method === 'PUT') {
    return handlePut(req, res, id);
  }

  return methodNotAllowed(res, ['GET', 'PUT']);
}

/**
 * GET /api/users/[id]
 * Get a single user by ID
 * Admin only
 */
async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  id: string
) {
  try {
    const session = await requirePermission(req, res, Permission.VIEW_USERS);
    if (!session) return;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            movements: true,
            sessions: true,
          },
        },
      },
    });

    if (!user) {
      return sendError(
        res,
        'Usuario no encontrado',
        'NOT_FOUND',
        404
      );
    }

    return sendSuccess(res, user);
  } catch (error) {
    console.error('Error getting user:', error);
    return sendError(
      res,
      'Error al obtener usuario',
      'INTERNAL_ERROR',
      500
    );
  }
}

/**
 * PUT /api/users/[id]
 * Update a user (name and role only)
 * Admin only
 */
async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  id: string
) {
  try {
    const session = await requirePermission(req, res, Permission.EDIT_USERS);
    if (!session) return;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return sendError(
        res,
        'Usuario no encontrado',
        'NOT_FOUND',
        404
      );
    }
    const validatedData: UpdateUserInput = updateUserSchema.parse(req.body);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
    }

    if (validatedData.phone !== undefined) {
      updateData.phone = validatedData.phone;
    }

    if (validatedData.role !== undefined) {
      updateData.role = validatedData.role;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return sendSuccess(res, user);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(
        res,
        'Datos de usuario inválidos',
        'VALIDATION_ERROR',
        400,
        error.issues
      );
    }

    console.error('Error updating user:', error);
    return sendError(
      res,
      'Error al actualizar usuario',
      'INTERNAL_ERROR',
      500
    );
  }
}
