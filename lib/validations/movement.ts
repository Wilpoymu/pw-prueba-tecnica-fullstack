import { z } from 'zod';

/**
 * Enum for movement types
 */
export const MovementTypeEnum = z.enum(['INCOME', 'EXPENSE']);

/**
 * Schema for creating a new movement
 * Campos según requerimientos: Monto, Concepto, Fecha
 */
export const createMovementSchema = z.object({
  concept: z
    .string()
    .min(3, 'El concepto debe tener al menos 3 caracteres')
    .max(255, 'El concepto no puede exceder 255 caracteres')
    .trim(),
  amount: z
    .number()
    .positive('El monto debe ser mayor a 0')
    .max(999999999999, 'El monto es demasiado grande'),
  type: MovementTypeEnum,
  date: z.string().datetime().optional().or(z.date().optional()),
});

/**
 * Schema for updating an existing movement
 */
export const updateMovementSchema = z.object({
  concept: z
    .string()
    .min(3, 'El concepto debe tener al menos 3 caracteres')
    .max(255, 'El concepto no puede exceder 255 caracteres')
    .trim()
    .optional(),
  amount: z
    .number()
    .positive('El monto debe ser mayor a 0')
    .max(999999999999, 'El monto es demasiado grande')
    .optional(),
  type: MovementTypeEnum.optional(),
  date: z.string().datetime().optional().or(z.date().optional()),
});

/**
 * Schema for query parameters when listing movements
 */
export const listMovementsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  type: MovementTypeEnum.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sortBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

/**
 * Type exports for TypeScript
 */
export type CreateMovementInput = z.infer<typeof createMovementSchema>;
export type UpdateMovementInput = z.infer<typeof updateMovementSchema>;
export type ListMovementsQuery = z.infer<typeof listMovementsQuerySchema>;
export type MovementType = z.infer<typeof MovementTypeEnum>;
