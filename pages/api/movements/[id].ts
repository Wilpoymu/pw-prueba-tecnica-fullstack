import { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import {
  sendSuccess,
  sendError,
  requireAuth,
  requirePermission,
  methodNotAllowed,
  ApiResponse,
} from '@/lib/api/helpers';
import {
  updateMovementSchema,
  UpdateMovementInput,
} from '@/lib/validations/movement';
import { Permission } from '@/lib/rbac/permissions';
import prisma from '@/lib/prisma';

/**
 * GET /api/movements/[id] - Get a single movement
 * PUT /api/movements/[id] - Update a movement
 * DELETE /api/movements/[id] - Delete a movement (soft delete)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return sendError(res, 'ID de movimiento inválido', 'INVALID_ID', 400);
  }

  if (req.method === 'GET') {
    return handleGet(req, res, id);
  }

  if (req.method === 'PUT') {
    return handlePut(req, res, id);
  }

  if (req.method === 'DELETE') {
    return handleDelete(req, res, id);
  }

  return methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
}

/**
 * GET /api/movements/[id]
 * Get a single movement by ID
 */
async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  id: string
) {
  try {
    // Require authentication
    const session = await requireAuth(req, res);
    if (!session) return;

    // Find movement
    const movement = await prisma.movement.findFirst({
      where: {
        id,
        deletedAt: null,
        // Non-admin users can only see their own movements
        ...(session.user.role !== 'ADMIN' && { userId: session.user.id }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!movement) {
      return sendError(
        res,
        'Movimiento no encontrado',
        'NOT_FOUND',
        404
      );
    }

    return sendSuccess(res, movement);
  } catch (error) {
    console.error('Error getting movement:', error);
    return sendError(
      res,
      'Error al obtener movimiento',
      'INTERNAL_ERROR',
      500
    );
  }
}

/**
 * PUT /api/movements/[id]
 * Update a movement (Admin only)
 */
async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  id: string
) {
  try {
    // Require admin permission
    const session = await requirePermission(req, res, Permission.EDIT_MOVEMENT);
    if (!session) return;

    // Check if movement exists
    const existingMovement = await prisma.movement.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingMovement) {
      return sendError(
        res,
        'Movimiento no encontrado',
        'NOT_FOUND',
        404
      );
    }

    // Validate request body
    const validatedData: UpdateMovementInput = updateMovementSchema.parse(req.body);

    // Build update data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (validatedData.concept !== undefined) {
      updateData.concept = validatedData.concept;
    }

    if (validatedData.amount !== undefined) {
      updateData.amount = validatedData.amount;
    }

    if (validatedData.type !== undefined) {
      updateData.type = validatedData.type;
    }

    if (validatedData.date !== undefined) {
      updateData.date = new Date(validatedData.date);
    }

    // Update movement
    const movement = await prisma.movement.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return sendSuccess(res, movement);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(
        res,
        'Datos de movimiento inválidos',
        'VALIDATION_ERROR',
        400,
        error.issues
      );
    }

    console.error('Error updating movement:', error);
    return sendError(
      res,
      'Error al actualizar movimiento',
      'INTERNAL_ERROR',
      500
    );
  }
}

/**
 * DELETE /api/movements/[id]
 * Soft delete a movement (Admin only)
 */
async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  id: string
) {
  try {
    // Require admin permission
    const session = await requirePermission(req, res, Permission.DELETE_MOVEMENT);
    if (!session) return;

    // Check if movement exists
    const existingMovement = await prisma.movement.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingMovement) {
      return sendError(
        res,
        'Movimiento no encontrado',
        'NOT_FOUND',
        404
      );
    }

    // Soft delete (mark as deleted)
    const movement = await prisma.movement.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return sendSuccess(res, { 
      message: 'Movimiento eliminado exitosamente',
      id: movement.id,
    });
  } catch (error) {
    console.error('Error deleting movement:', error);
    return sendError(
      res,
      'Error al eliminar movimiento',
      'INTERNAL_ERROR',
      500
    );
  }
}
