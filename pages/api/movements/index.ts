import { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import {
  sendSuccess,
  sendError,
  requireAuth,
  requirePermission,
  methodNotAllowed,
  calculatePagination,
  parseQueryParam,
  ApiResponse,
} from '@/lib/api/helpers';
import {
  createMovementSchema,
  listMovementsQuerySchema,
  CreateMovementInput,
} from '@/lib/validations/movement';
import { Permission } from '@/lib/rbac/permissions';
import prisma from '@/lib/prisma';

/**
 * GET /api/movements - List movements
 * POST /api/movements - Create a new movement
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  }

  if (req.method === 'POST') {
    return handlePost(req, res);
  }

  return methodNotAllowed(res, ['GET', 'POST']);
}

/**
 * GET /api/movements
 * List movements with filtering, sorting, and pagination
 */
async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const session = await requireAuth(req, res);
    if (!session) return;

    const queryParams = {
      page: parseQueryParam(req.query.page),
      limit: parseQueryParam(req.query.limit),
      type: parseQueryParam(req.query.type),
      startDate: parseQueryParam(req.query.startDate),
      endDate: parseQueryParam(req.query.endDate),
      sortBy: parseQueryParam(req.query.sortBy),
      sortOrder: parseQueryParam(req.query.sortOrder),
      search: parseQueryParam(req.query.search),
    };

    const validatedQuery = listMovementsQuerySchema.parse(queryParams);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      deletedAt: null,
    };

    if (session.user.role !== 'ADMIN') {
      where.userId = session.user.id;
    }

    if (validatedQuery.type) {
      where.type = validatedQuery.type;
    }

    if (validatedQuery.startDate || validatedQuery.endDate) {
      where.date = {};
      if (validatedQuery.startDate) {
        where.date.gte = new Date(validatedQuery.startDate);
      }
      if (validatedQuery.endDate) {
        where.date.lte = new Date(validatedQuery.endDate);
      }
    }

    if (validatedQuery.search) {
      where.concept = {
        contains: validatedQuery.search,
        mode: 'insensitive',
      };
    }

    const skip = (validatedQuery.page - 1) * validatedQuery.limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: any = {
      [validatedQuery.sortBy]: validatedQuery.sortOrder,
    };

    const total = await prisma.movement.count({ where });

    const movements = await prisma.movement.findMany({
      where,
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
      orderBy,
      skip,
      take: validatedQuery.limit,
    });

    const pagination = calculatePagination(
      validatedQuery.page,
      validatedQuery.limit,
      total
    );

    return sendSuccess(res, movements, pagination);
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

    console.error('Error listing movements:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return sendError(
      res,
      'Error al listar movimientos',
      'INTERNAL_ERROR',
      500
    );
  }
}

/**
 * POST /api/movements
 * Create a new movement (Admin only)
 */
async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const session = await requirePermission(req, res, Permission.CREATE_MOVEMENT);
    if (!session) return;

    const validatedData: CreateMovementInput = createMovementSchema.parse(req.body);
    
    const amountDecimal = validatedData.amount;

    const movement = await prisma.movement.create({
      data: {
        concept: validatedData.concept,
        amount: amountDecimal,
        type: validatedData.type,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        userId: session.user.id,
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

    console.error('Error creating movement:', error);
    return sendError(
      res,
      'Error al crear movimiento',
      'INTERNAL_ERROR',
      500
    );
  }
}
