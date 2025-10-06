import { z } from 'zod';

/**
 * Schema for listing users with pagination, filtering, and sorting
 */
export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
  sortBy: z
    .enum(['name', 'email', 'createdAt', 'updatedAt'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Schema for updating user information
 * only name, phone, and role can be updated
 */
export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(1, 'El nombre es requerido')
      .max(255, 'El nombre es demasiado largo')
      .optional(),
    phone: z
      .string()
      .min(1, 'El teléfono no puede estar vacío')
      .max(20, 'El teléfono es demasiado largo')
      .optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.phone !== undefined ||
      data.role !== undefined,
    {
      message: 'Debe proporcionar al menos un campo para actualizar',
    }
  );

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
